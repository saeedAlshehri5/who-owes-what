export function calculateSettlement(friends, expenses) {
  const balances = new Map(
    friends.map((friend) => [friend.id, 0])
  );

  let totalInHalalas = 0;

  for (const expense of expenses) {
    totalInHalalas += expense.amountInHalalas;

    // Credit the person who paid.
    balances.set(
      expense.payerId,
      balances.get(expense.payerId) + expense.amountInHalalas
    );

    // Use friends-list order for consistent rounding.
    const participants = friends.filter((friend) =>
      expense.participantIds.includes(friend.id)
    );

    const share = Math.floor(
      expense.amountInHalalas / participants.length
    );

    const remainder =
      expense.amountInHalalas % participants.length;

    // Charge each participant their share.
    participants.forEach((friend, index) => {
      const contribution = share + (index < remainder ? 1 : 0);

      balances.set(
        friend.id,
        balances.get(friend.id) - contribution
      );
    });
  }

  const people = friends.map((friend) => ({
    ...friend,
    balanceInHalalas: balances.get(friend.id),
  }));

  const creditors = people
    .filter((person) => person.balanceInHalalas > 0)
    .map((person) => ({
      id: person.id,
      remaining: person.balanceInHalalas,
    }));

  const debtors = people
    .filter((person) => person.balanceInHalalas < 0)
    .map((person) => ({
      id: person.id,
      remaining: -person.balanceInHalalas,
    }));

  const payments = [];
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (
    debtorIndex < debtors.length &&
    creditorIndex < creditors.length
  ) {
    const debtor = debtors[debtorIndex];
    const creditor = creditors[creditorIndex];

    const amountInHalalas = Math.min(
      debtor.remaining,
      creditor.remaining
    );

    payments.push({
      fromId: debtor.id,
      toId: creditor.id,
      amountInHalalas,
    });

    debtor.remaining -= amountInHalalas;
    creditor.remaining -= amountInHalalas;

    if (debtor.remaining === 0) {
      debtorIndex += 1;
    }

    if (creditor.remaining === 0) {
      creditorIndex += 1;
    }
  }

  return {
    totalInHalalas,
    people,
    payments,
  };
}