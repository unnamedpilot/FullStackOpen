import { create } from 'zustand'

const useNotificationStore = create(set => ({
    message: null,
    actions: {
        showNotification: (message) => {
            set(() => ({ message: message }))
            setTimeout(() => {
                set(() => ({message: null}))
            }, 5000);
        }
    }
}))

export const useNotification = () => useNotificationStore(state => state.message)
export const useNotificationActions = () => useNotificationStore(state => state.actions)