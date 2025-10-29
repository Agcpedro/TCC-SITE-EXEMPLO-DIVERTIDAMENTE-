"use client";

type Props = {
  points: number;
  hasActiveSubscription: boolean;
};

export const Items = ({
  points,
  hasActiveSubscription,
}: Props) => {
  return (
    <div className="w-full text-center py-12">
      <div className="text-6xl mb-4">🏆</div>
      <h2 className="text-2xl font-bold text-neutral-700 mb-2">
        Loja em Desenvolvimento
      </h2>
      <p className="text-muted-foreground">
        Em breve você poderá usar seus {points} XP para comprar itens especiais!
      </p>
    </div>
  );
};
