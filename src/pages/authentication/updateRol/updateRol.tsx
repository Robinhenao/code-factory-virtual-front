import { useState } from "react";
import { useMutation, useQuery } from '@apollo/client';
import { GET_ALL_USERS, UPDATE_USER_ROLE } from '@/graphql/mutations';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const ROLES = ['Cliente', 'Administrador'];

interface User {
  id: string;
  fullName: string;
  email: string;
  role: string;
}

const UpdateRolPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Query to get all users
  const { data: usersData, loading: usersLoading, error: usersError } = useQuery(GET_ALL_USERS);

  // Update role mutation
  const [updateUserRole, { loading: updateLoading }] = useMutation(UPDATE_USER_ROLE, {
    onCompleted: () => {
      setAlertMessage("Rol actualizado correctamente");
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    onError: (error) => {
      setAlertMessage(`Error al actualizar rol: ${error.message}`);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    },
    refetchQueries: [{ query: GET_ALL_USERS }]
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole({
        variables: {
          input: {
            userId,
            role: newRole
          }
        }
      });
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const filteredUsers = usersData?.getAllUsers.filter((user: User) =>
    user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (usersError) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error cargando usuarios: {usersError.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {showAlert && (
        <Alert variant={alertMessage.includes('Error') ? "destructive" : "default"}>
          <AlertDescription>{alertMessage}</AlertDescription>
        </Alert>
      )}

      <Input
        type="text"
        placeholder="Buscar por nombre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-md"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-10">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user: User) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => handleRoleChange(user.id, value)}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((role) => (
                          <SelectItem key={role} value={role}>
                            {role}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline"
                      disabled={updateLoading}
                      onClick={() => handleRoleChange(user.id, user.role)}
                    >
                      {updateLoading && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Guardar
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default UpdateRolPage;