// Function to check user membership in channels
export const checkMembershipChannels = async (bot, userId, channels) => {
  let allMembers = true
  const remainingChannels = []

  // Loop through channels and check if the user is a member
  for (const channel of channels) {
    try {
      const chatMember = await bot.getChatMember(channel.id, userId)
      
      // If the user is not a member, administrator, or creator, they are not a member
      if (!['member', 'administrator', 'creator'].includes(chatMember.status)) {
        allMembers = false
        remainingChannels.push(channel)
      }
    } catch (error) {
      console.log('Error fetching chat member status:', error)
      allMembers = false
      remainingChannels.push(channel)
    }
  }

  return { allMembers, remainingChannels }
}