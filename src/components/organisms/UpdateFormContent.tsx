import { FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormRegister } from "@/components/atoms/FormRegister";
import { Loader2 } from "lucide-react";

interface UpdateFormContentProps {
  formValues: {
    name: string;
    cellphone: string;
  };
  errors: {
    name: string | null;
    cellphone: string | null;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => void;
  isLoading: boolean;
}

export const UpdateFormContent = ({
  formValues,
  errors,
  onInputChange,
  onSubmit,
  isLoading,
}: UpdateFormContentProps) => (
  <form onSubmit={onSubmit}>
    <Card className="mx-auto max-w-md">
      <CardHeader className="items-center">
        <CardTitle className="text-xl">Actualizar Información</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <FormRegister
            id="name"
            label="Nombre"
            type="text"
            placeholder="Ingresa tu nombre"
            value={formValues.name}
            onChange={onInputChange}
            error={errors.name}
          />

          <FormRegister
            id="cellphone"
            label="Número de teléfono"
            type="text"
            placeholder="Número de teléfono"
            value={formValues.cellphone}
            onChange={onInputChange}
            error={errors.cellphone}
          />

          <div className="text-center">
            <Button type="submit" className="w-auto" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Cargando...
                </>
              ) : (
                "Actualizar"
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  </form>
);
