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
            // Обработчики для переключения режимов
            const listenerBtn = context.shadowRoot.querySelector('#listener-mode-btn');
            const dialerBtn = context.shadowRoot.querySelector('#dialer-mode-btn');

            if (listenerBtn) {
                const listenerHandler = async () => {
                    try {
                        await context.switchMode('listener');
                        console.log('Переключен в режим listener');
                    } catch (error) {
                        console.error('Ошибка переключения в режим listener:', error);
                    }
                };
                listenerBtn.addEventListener('click', listenerHandler);
                eventListeners.push({ element: listenerBtn, handler: listenerHandler });
            }

            if (dialerBtn) {
                const dialerHandler = async () => {
                    try {
                        await context.switchMode('dialer');
                        console.log('Переключен в режим dialer');
                    } catch (error) {
                        console.error('Ошибка переключения в режим dialer:', error);
                    }
                };
                dialerBtn.addEventListener('click', dialerHandler);
                eventListeners.push({ element: dialerBtn, handler: dialerHandler });
            }

            // Обработчик подключения к пиру
            const connectBtn = context.shadowRoot.querySelector('#connect-peer-btn');
            const peerAddressInput = context.shadowRoot.querySelector('#peer-address-input');

            if (connectBtn && peerAddressInput) {
                const connectHandler = async () => {
                    const address = peerAddressInput.value.trim();
                    if (address) {
                        try {
                            await context.connectToPeer(address);
                            peerAddressInput.value = '';
                            console.log(`Подключение к пиру: ${address}`);
                        } catch (error) {
                            console.error('Ошибка подключения к пиру:', error);
                            context.addError({
                                componentName: context.constructor.name,
                                source: 'controller-connect',
                                message: `Ошибка подключения к ${address}`,
                                details: error
                            });
                        }
                    }
                };

                connectBtn.addEventListener('click', connectHandler);
                eventListeners.push({ element: connectBtn, handler: connectHandler });

                // Также обрабатываем Enter в поле ввода
                const enterHandler = (event) => {
                    if (event.key === 'Enter') {
                        connectHandler();
                    }
                };
                peerAddressInput.addEventListener('keypress', enterHandler);
                eventListeners.push({ element: peerAddressInput, handler: enterHandler });
            }

            // Обработчик обновления списка пиров
            const refreshBtn = context.shadowRoot.querySelector('#refresh-peers-btn');
            if (refreshBtn) {
                const refreshHandler = async () => {
                    try {
                        await context.updatePeerList();
                        console.log('Список пиров обновлен');
                    } catch (error) {
                        console.error('Ошибка обновления списка пиров:', error);
                    }
                };
                refreshBtn.addEventListener('click', refreshHandler);
                eventListeners.push({ element: refreshBtn, handler: refreshHandler });
            }

            // Обработчик копирования адресов
            const copyAddressesBtn = context.shadowRoot.querySelector('#copy-addresses-btn');
            if (copyAddressesBtn) {
                const copyHandler = async () => {
                    try {
                        const addresses = await context.getRelayAddresses();
                        const textToCopy = addresses.join('\n');
                        await navigator.clipboard.writeText(textToCopy);
                        console.log('Адреса скопированы в буфер обмена');

                        // Временная визуальная обратная связь
                        copyAddressesBtn.textContent = 'Скопировано!';
                        setTimeout(() => {
                            copyAddressesBtn.textContent = 'Копировать адреса';
                        }, 2000);
                    } catch (error) {
                        console.error('Ошибка копирования адресов:', error);
                    }
                };
                copyAddressesBtn.addEventListener('click', copyHandler);
                eventListeners.push({ element: copyAddressesBtn, handler: copyHandler });
            }

            // Обработчик переключения relay
            const relayToggle = context.shadowRoot.querySelector('#relay-toggle');
            if (relayToggle) {
                const relayHandler = (event) => {
                    context.state.relayEnabled = event.target.checked;
                    console.log(`Relay ${context.state.relayEnabled ? 'включен' : 'выключен'}`);
                };
                relayToggle.addEventListener('change', relayHandler);
                eventListeners.push({ element: relayToggle, handler: relayHandler });
            }

            console.log('[PeerConnection] Контроллер инициализирован');
        },

        /**
         * Уничтожает контроллер и очищает ресурсы
         * @async
         */
        async destroy() {
            // Очистка всех обработчиков событий
            eventListeners.forEach(({ element, handler }) => {
                element.removeEventListener('click', handler);
                element.removeEventListener('keypress', handler);
                element.removeEventListener('change', handler);
            });
            eventListeners = [];

            console.log('[PeerConnection] Контроллер уничтожен');
        }
    };
};