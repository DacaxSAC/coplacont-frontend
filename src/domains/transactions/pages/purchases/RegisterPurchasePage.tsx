import { PageLayout } from "@/components";
import { CreatePurchaseForm } from "@/domains/transactions/organisms";

export const RegisterPurchasePage: React.FC = () => {
  return (
    <PageLayout
      title="Registrar compra"
      subtitle="Permite registrar una nueva compra con sus datos."
    >
      <CreatePurchaseForm />
    </PageLayout>
  );
};
