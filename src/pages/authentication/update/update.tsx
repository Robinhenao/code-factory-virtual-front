import { useState, FormEvent, ChangeEvent, useEffect } from "react";
import { SuccessAlert } from "@/components/molecules/SuccessAlert";
import { useMutation, useQuery } from '@apollo/client';
import { GET_USER, UPDATE_USER } from '@/graphql/mutations';
import { UpdateFormContent } from "@/components/organisms/UpdateFormContent";
import { jwtDecode } from "jwt-decode";
import { Token, User } from "@/types/graphql";
import { getFromLocalStorage } from "@/lib/tokenUtils";

interface UpdateFormValues {
    name: string;
    cellphone: string;
}

interface FormErrors {
    name: string | null;
    cellphone: string | null;
}

interface UpdateUserResponse {
    updateUser: {
        id: string;
    }
}

const INITIAL_ERRORS: FormErrors = {
    name: null,
    cellphone: null,
};

const CELLPHONE_REGEX = /^3\d{9}$/;

export function UpdatePage() {
    const [userId, setUserId] = useState<string | null>(null);
    const [formValues, setFormValues] = useState<UpdateFormValues>({
        name: '',
        cellphone: '',
    });

    // Token decoding effect
    useEffect(() => {
        const token = getFromLocalStorage('token', null);
        if (token) {
            try {
                const userDecoded: Token = jwtDecode(token);
                setUserId(userDecoded.id);
            } catch (error) {
                console.error('Error decoding token:', error);
            }
        }
    }, []);

    // Query to get user data
    const { data: userData } = useQuery<{ getUser: User }>(GET_USER, {
        variables: { id: userId },
        skip: !userId,
    });

    // Update form values when user data is loaded
    useEffect(() => {
        if (userData?.getUser) {
            setFormValues({
                name: userData.getUser.fullName,
                cellphone: userData.getUser.phoneNumber,
            });
        }
    }, [userData]);

    const [errors, setErrors] = useState<FormErrors>(INITIAL_ERRORS);
    const [alertDialogOpen, setAlertDialogOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    
    const [updateUser, { loading }] = useMutation<UpdateUserResponse>(UPDATE_USER, {
        onCompleted: () => {
            setAlertMessage("La información se ha actualizado correctamente.");
            setAlertDialogOpen(true);
            setErrors(INITIAL_ERRORS);
        },
        onError: (error) => {
            setAlertMessage(`Error al actualizar: ${error.message}`);
            setAlertDialogOpen(true);
        },
    });

    const validateField = (id: keyof UpdateFormValues, value: string): string | null => {
        switch (id) {
            case "name":
                return value.trim() === "" ? "El nombre no es válido" : null;
            case "cellphone":
                return !CELLPHONE_REGEX.test(value) ? "El número de teléfono no es válido" : null;
            default:
                return null;
        }
    };

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const fieldName = id as keyof UpdateFormValues;

        setFormValues(prev => ({ ...prev, [fieldName]: value }));
        setErrors(prev => ({
            ...prev,
            [fieldName]: validateField(fieldName, value)
        }));
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {
            name: validateField("name", formValues.name),
            cellphone: validateField("cellphone", formValues.cellphone),
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error !== null);
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !userId) {
            setAlertMessage("Por favor, verifica los datos del formulario.");
            setAlertDialogOpen(true);
            return;
        }

        try {
            await updateUser({
                variables: {
                    id: userId,
                    fullName: formValues.name,
                    phoneNumber: formValues.cellphone,
                }
            });
        } catch (error) {
            console.error('Error in form submission:', error);
        }
    };

    return (
        <>
            <div className="flex justify-center items-center min-h-screen py-8">
                <UpdateFormContent
                    formValues={formValues}
                    errors={errors}
                    onInputChange={handleInputChange}
                    onSubmit={handleSubmit}
                    isLoading={loading}
                />

                <SuccessAlert
                    isOpen={alertDialogOpen}
                    onOpenChange={setAlertDialogOpen}
                    message={alertMessage}
                />
            </div>
        </>
    );
}

export default UpdatePage;