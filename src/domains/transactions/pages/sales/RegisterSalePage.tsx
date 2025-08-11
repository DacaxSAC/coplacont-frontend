import { PageLayout } from "@/components";
import { CreateSaleForm } from "@/domains/transactions/organisms/CreateSaleForm";

export const RegisterSalePage: React.FC = () => {
  return (
    <PageLayout
      title="Registrar venta"
      subtitle="Permite registrar una nueva venta con sus datos."
    >
      <CreateSaleForm />
    </PageLayout>
  );
};
