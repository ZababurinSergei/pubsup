export async function createActions(context) {
    return {
        async subscribeToGroup(topic) {
            if (context.node) {
                try {
                    await context.node.services.pubsub.subscribe(topic);
                    console.log(`✅ Subscribed to group: ${topic}`);
                    return true;
                } catch (error) {
                    console.error(`❌ Error subscribing to group ${topic}:`, error);
                    return false;
                }
            }
            return false;
        },

        async unsubscribeFromGroup(topic) {
            if (context.node) {
                try {
                    await context.node.services.pubsub.unsubscribe(topic);
                    console.log(`✅ Unsubscribed from group: ${topic}`);
                    return true;
                } catch (error) {
                    console.error(`❌ Error unsubscribing from group ${topic}:`, error);
                    return false;
                }
            }
            return false;
        },

        async sendMessage(topic, messageText) {
            if (context.node) {
                try {
                    await context.node.services.pubsub.publish(topic, new TextEncoder().encode(messageText));
                    console.log(`✅ Message sent to topic ${topic}: ${messageText}`);
                    return true;
                } catch (error) {
                    console.error(`❌ Error sending message to topic ${topic}:`, error);
                    return false;
                }
            }
            return false;
        },

        async discoverGroups() {
            if (!context.node) return [];

            try {
                const topics = Array.from(context.node.services.pubsub.getTopics());
                const groups = [];

                for (const topic of topics) {
                    if (topic.startsWith('chat-group-')) {
                        const peers = context.node.services.pubsub.getSubscribers(topic);
                        groups.push({
                            topic: topic,
                            name: topic.replace('chat-group-', '').split('-')[0],
                            memberCount: peers.size,
                            peers: Array.from(peers).map(p => p.toString())
                        });
                    }
                }

                return groups;
            } catch (error) {
                console.error('❌ Error discovering groups:', error);
                return [];
            }
        }
    };
}