
import { Card, CardContent } from "./ui/card";
export const AppointmentCard = ({ title, count, icon, bgColor }) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-lg ${bgColor}`}>
            {icon}
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{count}</p>
            <p className="text-sm text-muted-foreground">{title}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
