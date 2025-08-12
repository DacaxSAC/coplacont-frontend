import { PageLayout } from "@/components";
import { CreateSaleForm } from "@/domains/transactions/organisms/CreateSaleForm";

export const RegisterPage: React.FC = () => {
  return (
    <PageLayout
      title="Registrar venta"
      subtitle="Permite registrar una nueva venta con sus datos."
    >
      <CreateSaleForm />
    </PageLayout>
  );
};
