import { defineStore } from 'pinia'
import { useAuthStore } from './auth'
import notify from '@/utils/notify'
import axiosApi from '@/utils/axiosApi'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    loading: false,
  }),

  actions: {
    async toggleSubscription(targetUser, onUpdate = null) {
      const auth = useAuthStore()

      if (!auth.isLoggedIn) {
        notify.info('Please login to subscribe to a channel.')
        return false
      }

      if (targetUser.id === auth.currentUser.id) {
        notify.info('You cannot subscribe to yourself!')
        return false
      }

      try {
        this.loading = true
        const res = await axiosApi.post(`user/${targetUser.id}/subscribe`)
        notify.success(res.data?.message)

        const alreadySubscribed = targetUser.subscribers?.some(
          (s) => s.subscriber_id === auth.currentUser.id,
        )

        if (alreadySubscribed) {
          targetUser.subscribers = targetUser.subscribers.filter(
            (s) => s.subscriber_id !== auth.currentUser.id,
          )
        } else {
          targetUser.subscribers.push({
            creator_id: targetUser.id,
            subscriber_id: auth.currentUser.id,
          })
        }

        if (onUpdate) onUpdate(targetUser)

        return true
      } catch (err) {
        const errMsg = err.response?.data?.detail || 'Something went wrong!'
        notify.error(errMsg)
        return false
      } finally {
        this.loading = false
      }
    },

    isSubscribedTo(targetUser) {
      const auth = useAuthStore()
      if (!auth.isLoggedIn) return false
      return targetUser?.subscribers?.some((s) => s.subscriber_id === auth.currentUser.id) ?? false
    },
  },
})
