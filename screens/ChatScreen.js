import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { db, auth } from '../firebaseConfig';
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { i18n } from '../i18n';

const ChatScreen = ({ navigation, route }) => {
    const { recipientId, recipientName } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const flatListRef = useRef(null);

    const currentUser = auth.currentUser;

    // Generate a consistent conversation ID based on the two user IDs
    const getConversationId = (uid1, uid2) => {
        return [uid1, uid2].sort().join('_');
    };

    const conversationId = getConversationId(currentUser.uid, recipientId);

    useEffect(() => {
        const q = query(
            collection(db, `conversations/${conversationId}/messages`),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setMessages(msgs);
            setLoading(false);
        });

        return unsubscribe;
    }, [conversationId]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        const textToSend = newMessage.trim();
        setNewMessage('');

        try {
            await addDoc(collection(db, `conversations/${conversationId}/messages`), {
                text: textToSend,
                createdAt: serverTimestamp(),
                senderId: currentUser.uid,
                senderName: currentUser.displayName || currentUser.email,
                recipientId: recipientId
            });
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    const renderMessage = ({ item }) => {
        const isMe = item.senderId === currentUser.uid;
        return (
            <View style={[
                styles.messageBubble,
                isMe ? styles.myMessage : styles.theirMessage
            ]}>
                <Text style={[styles.messageText, isMe ? styles.myMessageText : styles.theirMessageText]}>
                    {item.text}
                </Text>
                <Text style={[styles.timeText, isMe ? styles.myTimeText : styles.theirTimeText]}>
                    {item.createdAt ? new Date(item.createdAt.toDate()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '...'}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="#333" />
                </TouchableOpacity>
                <View style={styles.headerTitleContainer}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{recipientName?.charAt(0).toUpperCase()}</Text>
                    </View>
                    <Text style={styles.headerTitle}>{recipientName}</Text>
                </View>
                <TouchableOpacity style={styles.moreButton}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#333" />
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
                style={styles.keyboardAvoidingView}
            >
                {loading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color="#00BCD4" />
                    </View>
                ) : (
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        inverted
                        contentContainerStyle={styles.messagesList}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder={i18n.t('type_message') || "Type a message..."}
                        value={newMessage}
                        onChangeText={setNewMessage}
                        multiline
                    />
                    <TouchableOpacity
                        style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]}
                        onPress={handleSend}
                        disabled={!newMessage.trim()}
                    >
                        <Ionicons name="send" size={24} color="#FFF" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F0F2F5' },
    header: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 10, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#E0E0E0',
        elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 2
    },
    headerTitleContainer: { flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 10 },
    avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00BCD4', justifyContent: 'center', alignItems: 'center', marginRight: 10 },
    avatarText: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
    headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    backButton: { padding: 5 },
    moreButton: { padding: 5 },
    keyboardAvoidingView: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    messagesList: { paddingHorizontal: 10, paddingBottom: 10 },
    messageBubble: {
        maxWidth: '80%', padding: 12, borderRadius: 20, marginVertical: 5, elevation: 1
    },
    myMessage: {
        alignSelf: 'flex-end', backgroundColor: '#00BCD4', borderBottomRightRadius: 4
    },
    theirMessage: {
        alignSelf: 'flex-start', backgroundColor: '#FFF', borderBottomLeftRadius: 4
    },
    messageText: { fontSize: 16 },
    myMessageText: { color: '#FFF' },
    theirMessageText: { color: '#333' },
    timeText: { fontSize: 10, marginTop: 5, textAlign: 'right' },
    myTimeText: { color: 'rgba(255,255,255,0.7)' },
    theirTimeText: { color: '#999' },
    inputContainer: {
        flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#FFF',
        borderTopWidth: 1, borderTopColor: '#EEE'
    },
    input: {
        flex: 1, backgroundColor: '#F0F2F5', borderRadius: 25, paddingHorizontal: 20, paddingVertical: 10,
        fontSize: 16, maxHeight: 100
    },
    sendButton: {
        backgroundColor: '#00BCD4', width: 45, height: 45, borderRadius: 22.5,
        justifyContent: 'center', alignItems: 'center', marginLeft: 10, elevation: 2
    },
    sendButtonDisabled: { backgroundColor: '#DDD' }
});

export default ChatScreen;
