// Function to create join channel buttons
export const createJoinButtons = (channels, reverify) => {
  // Create buttons for each channel
  const buttons = channels.map((channel) => [
    {
      text: `عضویت در کانال ${channel.name && `( ${channel.name} )`}`,
      url: channel.link,
    },
  ])
  
  // Add a button for confirming membership
  buttons.push([
    {
      text: 'عضو شدم ✅',
      callback_data: reverify ? 'revrf_mem' : 'vrf_mem',
    },
  ])

  // Return buttons in the required format
  return buttons
}

export const createBackButton = (callback) => {
  const button = [{ text: '🔙 بازگشت', callback_data: `back_${callback}` }]

  return button
}

export const createDeleteButton = (callback) => {
  const button = [{ text: 'حذف 🗑', callback_data: `del_${callback}` }]

  return button
}
