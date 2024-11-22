export const formatProgressCards = (progressCards, selectedProjectId) => {
  const statusOrder = { 'To-Do': 1, 'In Progress': 2, 'Completed': 3 };

  // console.log("Status Order:", statusOrder);

  const sortedCards = progressCards.slice().sort((a, b) => {
    const dateA = new Date(a.created_ts), dateB = new Date(b.created_ts);
    if (dateA > dateB) return -1;
    if (dateA < dateB) return 1;

    // Logging for status comparison
    // console.log(`Comparing ${a.progressStatus} (${statusOrder[a.progressStatus]}) to ${b.progressStatus} (${statusOrder[b.progressStatus]})`);

    return statusOrder[a.progressStatus] - statusOrder[b.progressStatus];
  });

  if (!selectedProjectId) return sortedCards;
  return sortedCards.filter(card => card.projectId === selectedProjectId);
};
