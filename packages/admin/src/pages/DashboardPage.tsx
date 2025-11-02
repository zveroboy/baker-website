import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "../contexts/AuthContext";
import { useCurrentUser } from "../hooks/use-auth";

export default function DashboardPage() {
  const { data: user, isLoading } = useCurrentUser();
  const { logout } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Панель Администратора</h1>
          <Button variant="outline" onClick={logout}>
            Выйти
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Добро пожаловать, {user?.name}!</CardTitle>
            <CardDescription>
              Вы успешно вошли в панель администратора
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Email:</span> {user?.email}
              </p>
              <p>
                <span className="font-semibold">Роль:</span> {user?.role}
              </p>
              <p className="text-sm text-muted-foreground mt-4">
                Дополнительные функции панели администратора будут добавлены в
                следующих спринтах.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
