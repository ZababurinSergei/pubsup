/**
 * Контроллер для компонента PeerConnection
 * @param {HTMLElement} context - Ссылка на экземпляр компонента
 * @returns {Object} Объект с методами init и destroy
 */
export const controller = async (context) => {
    let eventListeners = [];

    return {
        /**
         * Инициализирует контроллер компонента
         * @async
         */
        async init() {
            console.log('🔧 PeerConnection controller initializing...');

            // Обработчики для копирования адресов
            const setupCopyHandlers = () => {
                const copyButtons = context.shadowRoot.querySelectorAll('.address-action.copy');
                copyButtons.forEach(button => {
                    const handler = async (e) => {
                        const addressItem = e.target.closest('.address-item');
                        if (addressItem) {
                            const address = addressItem.getAttribute('data-address');
                            if (address) {
                                await context.copyToClipboard(address, 'Адрес скопирован в буфер обмена', addressItem);
                            }
                        }
                    };
                    button.addEventListener('click', handler);
                    eventListeners.push({ element: button, handler: handler });
                });
            };

            // Обработчики для копирования Peer ID из детализированного списка
            const setupPeerCopyHandlers = () => {
                const copyPeerButtons = context.shadowRoot.querySelectorAll('.copy-peer-id');
                copyPeerButtons.forEach(button => {
                    const handler = async (e) => {
                        const peerId = e.target.getAttribute('data-peer-id');
                        if (peerId) {
                            console.log('ssssss', e.currentTarget)
                            debugger
                            await context.copyToClipboard(peerId, 'Peer ID скопирован в буфер обмена');
                        }
                    };
                    button.addEventListener('click', handler);
                    eventListeners.push({ element: button, handler: handler });
                });
            };

            // Наблюдатель за изменениями DOM для динамических кнопок
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'childList') {
                        setupCopyHandlers();
                        setupPeerCopyHandlers();
                    }
                });
            });

            // Начинаем наблюдение за изменениями в shadowRoot
            observer.observe(context.shadowRoot, {
                childList: true,
                subtree: true
            });

            // Сохраняем observer для очистки
            context._copyObserver = observer;

            // Инициализация кнопок при первом рендере
            setTimeout(() => {
                setupCopyHandlers();
                setupPeerCopyHandlers();
            }, 100);

            // Обработчик подключения к пиру
            const connectBtn = context.shadowRoot.querySelector('#connect-peer-btn');
            const peerAddressInput = context.shadowRoot.querySelector('#peer-address-input');

            // Обработчики для переключения режимов
            const listenerBtn = context.shadowRoot.querySelector('#listener-mode-btn');
            const dialerBtn = context.shadowRoot.querySelector('#dialer-mode-btn');

            console.log('🔍 Debug: button elements found', {
                listenerBtn: !!listenerBtn,
                dialerBtn: !!dialerBtn,
                listenerBtnId: listenerBtn?.id,
                dialerBtnId: dialerBtn?.id
            });

            if (listenerBtn) {
                const listenerHandler = async () => {
                    try {
                        console.log('🔧 Listener mode button clicked');
                        await context.switchMode('listener');
                        console.log('✅ Переключен в режим listener');
                    } catch (error) {
                        console.error('❌ Ошибка переключения в режим listener:', error);
                        context.addError({
                            componentName: context.constructor.name,
                            source: 'controller-listener',
                            message: 'Ошибка переключения в режим слушателя',
                            details: error
                        });
                    }
                };
                listenerBtn.addEventListener('click', listenerHandler);
                eventListeners.push({ element: listenerBtn, handler: listenerHandler });
                console.log('✅ Listener button handler attached');
            }

            if (dialerBtn) {
                const dialerHandler = async () => {
                    try {
                        console.log('🔧 Dialer mode button clicked');
                        await context.switchMode('dialer');
                        console.log('✅ Переключен в режим dialer');
                    } catch (error) {
                        console.error('❌ Ошибка переключения в режим dialer:', error);
                        context.addError({
                            componentName: context.constructor.name,
                            source: 'controller-dialer',
                            message: 'Ошибка переключения в режим инициатора',
                            details: error
                        });
                    }
                };
                dialerBtn.addEventListener('click', dialerHandler);
                eventListeners.push({ element: dialerBtn, handler: dialerHandler });
                console.log('✅ Dialer button handler attached');
            }

            // Дополнительная привязка через делегирование событий на случай проблем с элементами
            const modeSwitcher = context.shadowRoot.querySelector('.mode-switcher');
            if (modeSwitcher) {
                const modeDelegationHandler = async (event) => {
                    const button = event.target.closest('.mode-btn');
                    if (button) {
                        event.preventDefault();
                        event.stopPropagation();

                        const mode = button.id === 'listener-mode-btn' ? 'listener' : 'dialer';
                        console.log('🔧 Mode delegation handler triggered:', mode);

                        try {
                            await context.switchMode(mode);
                            console.log('✅ Mode switched via delegation:', mode);
                        } catch (error) {
                            console.error('❌ Error in mode delegation:', error);
                        }
                    }
                };

                modeSwitcher.addEventListener('click', modeDelegationHandler);
                eventListeners.push({ element: modeSwitcher, handler: modeDelegationHandler });
                console.log('✅ Mode switcher delegation handler attached');
            }

            if (connectBtn && peerAddressInput) {
                const connectHandler = async () => {
                    const address = peerAddressInput.value.trim();
                    if (address) {
                        try {
                            console.log('🔧 Connecting to peer:', address);
                            await context.connectToPeer(address);
                            peerAddressInput.value = '';
                            console.log(`✅ Подключение к пиру инициировано: ${address}`);
                        } catch (error) {
                            console.error('❌ Ошибка подключения к пиру:', error);
                            context.addError({
                                componentName: context.constructor.name,
                                source: 'controller-connect',
                                message: `Ошибка подключения к ${address}`,
                                details: error
                            });
                        }
                    } else {
                        console.warn('⚠️ Пустой адрес для подключения');
                    }
                };

                connectBtn.addEventListener('click', connectHandler);
                eventListeners.push({ element: connectBtn, handler: connectHandler });

                // Также обрабатываем Enter в поле ввода
                const enterHandler = (event) => {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        connectHandler();
                    }
                };
                peerAddressInput.addEventListener('keypress', enterHandler);
                eventListeners.push({ element: peerAddressInput, handler: enterHandler });

                console.log('✅ Peer connection handlers attached');
            }

            // Обработчик обновления списка пиров
            const refreshBtn = context.shadowRoot.querySelector('#refresh-peers-btn');
            if (refreshBtn) {
                const refreshHandler = async () => {
                    try {
                        console.log('🔧 Refreshing peer list...');
                        await context.updatePeerList();
                        console.log('✅ Список пиров обновлен');
                    } catch (error) {
                        console.error('❌ Ошибка обновления списка пиров:', error);
                    }
                };
                refreshBtn.addEventListener('click', refreshHandler);
                eventListeners.push({ element: refreshBtn, handler: refreshHandler });
                console.log('✅ Refresh peers handler attached');
            }

            // Обработчик копирования адресов
            const copyAddressesBtn = context.shadowRoot.querySelector('#copy-addresses-btn');
            if (copyAddressesBtn) {
                const copyHandler = async () => {
                    try {
                        console.log('🔧 Copying addresses...');
                        const addresses = await context.getRelayAddresses();
                        const textToCopy = addresses.join('\n');
                        await context.copyToClipboard(textToCopy, 'Все адреса скопированы в буфер обмена');
                    } catch (error) {
                        console.error('❌ Ошибка копирования адресов:', error);
                        context.addError({
                            componentName: context.constructor.name,
                            source: 'controller-copy-addresses',
                            message: 'Ошибка копирования адресов',
                            details: error
                        });
                    }
                };
                copyAddressesBtn.addEventListener('click', copyHandler);
                eventListeners.push({ element: copyAddressesBtn, handler: copyHandler });
                console.log('✅ Copy addresses handler attached');
            }

            // Обработчик переключения relay
            const relayToggle = context.shadowRoot.querySelector('#relay-toggle');
            if (relayToggle) {
                const relayHandler = (event) => {
                    context.state.relayEnabled = event.target.checked;
                    console.log(`🔧 Relay ${context.state.relayEnabled ? 'включен' : 'выключен'}`);

                    // Обновляем UI для отражения изменения
                    context.renderPart({
                        partName: 'renderSystemStatus',
                        state: context.state,
                        selector: '.status-card .card-content'
                    }).catch(console.error);
                };
                relayToggle.addEventListener('change', relayHandler);
                eventListeners.push({ element: relayToggle, handler: relayHandler });
                console.log('✅ Relay toggle handler attached');
            }

            // Обработчики быстрых действий
            this.setupQuickActions(context, eventListeners);

            console.log('✅ [PeerConnection] Контроллер инициализирован');
            console.log('📊 Total event listeners:', eventListeners.length);
        },

        /**
         * Настраивает обработчики для быстрых действий
         * @param {HTMLElement} context - Контекст компонента
         * @param {Array} eventListeners - Массив обработчиков событий
         */
        setupQuickActions(context, eventListeners) {
            // Копирование Peer ID
            const copyPeerIdBtn = context.shadowRoot.querySelector('#copy-peer-id');
            if (copyPeerIdBtn) {
                const copyPeerHandler = async () => {
                    try {
                        debugger
                        if (context.state.peerId) {
                            await context.copyToClipboard(context.state.peerId, 'Peer ID скопирован в буфер обмена');
                        }
                    } catch (error) {
                        console.error('❌ Ошибка копирования Peer ID:', error);
                    }
                };
                copyPeerIdBtn.addEventListener('click', copyPeerHandler);
                eventListeners.push({ element: copyPeerIdBtn, handler: copyPeerHandler });
            }

            // Копирование всех адресов
            const copyAllAddressesBtn = context.shadowRoot.querySelector('#copy-addresses');
            if (copyAllAddressesBtn) {
                const copyAllAddressesHandler = async () => {
                    try {
                        debugger
                        const addresses = context.state.listeningAddresses || [];
                        if (addresses.length > 0) {
                            const textToCopy = addresses.join('\n');
                            await context.copyToClipboard(textToCopy, 'Все адреса скопированы в буфер обмена');
                        }
                    } catch (error) {
                        console.error('❌ Ошибка копирования всех адресов:', error);
                    }
                };
                copyAllAddressesBtn.addEventListener('click', copyAllAddressesHandler);
                eventListeners.push({ element: copyAllAddressesBtn, handler: copyAllAddressesHandler });
            }

            // Отключение всех пиров
            const disconnectAllBtn = context.shadowRoot.querySelector('#disconnect-all');
            if (disconnectAllBtn) {
                const disconnectAllHandler = async () => {
                    try {
                        console.log('🔧 Disconnecting all peers...');
                        // Здесь должна быть логика отключения всех пиров
                        console.log('✅ Все пиры отключены');
                    } catch (error) {
                        console.error('❌ Ошибка отключения всех пиров:', error);
                    }
                };
                disconnectAllBtn.addEventListener('click', disconnectAllHandler);
                eventListeners.push({ element: disconnectAllBtn, handler: disconnectAllHandler });
            }

            // Перезапуск узла
            const restartNodeBtn = context.shadowRoot.querySelector('#restart-node');
            if (restartNodeBtn) {
                const restartHandler = async () => {
                    try {
                        console.log('🔧 Restarting node...');
                        await context.switchMode(context.state.mode); // Перезапуск в текущем режиме
                        console.log('✅ Узел перезапущен');
                    } catch (error) {
                        console.error('❌ Ошибка перезапуска узла:', error);
                    }
                };
                restartNodeBtn.addEventListener('click', restartHandler);
                eventListeners.push({ element: restartNodeBtn, handler: restartHandler });
            }

            // Обновление всего
            const refreshAllBtn = context.shadowRoot.querySelector('#refresh-all');
            if (refreshAllBtn) {
                const refreshAllHandler = async () => {
                    try {
                        console.log('🔧 Refreshing all data...');
                        await context.updatePeerList();
                        // Можно добавить обновление других данных
                        console.log('✅ Все данные обновлены');
                    } catch (error) {
                        console.error('❌ Ошибка обновления данных:', error);
                    }
                };
                refreshAllBtn.addEventListener('click', refreshAllHandler);
                eventListeners.push({ element: refreshAllBtn, handler: refreshAllHandler });
            }

            console.log('✅ Quick actions handlers attached');
        },

        /**
         * Уничтожает контроллер и очищает ресурсы
         * @async
         */
        async destroy() {
            console.log('🔧 PeerConnection controller destroying...');

            // Очистка всех обработчиков событий
            eventListeners.forEach(({ element, handler }) => {
                try {
                    element.removeEventListener('click', handler);
                    element.removeEventListener('input', handler);
                    element.removeEventListener('keypress', handler);
                    element.removeEventListener('change', handler);
                } catch (error) {
                    console.warn('⚠️ Error removing event listener:', error);
                }
            });

            // Остановка наблюдателя за DOM
            if (context._copyObserver) {
                context._copyObserver.disconnect();
                context._copyObserver = null;
            }

            console.log(`✅ Removed ${eventListeners.length} event listeners`);
            eventListeners = [];

            console.log('✅ [PeerConnection] Контроллер уничтожен');
        }
    };
};