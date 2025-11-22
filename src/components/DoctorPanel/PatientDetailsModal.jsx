import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MdPhone, MdEmail, MdLocationOn, MdWork, MdLanguage } from "react-icons/md";
import { Badge } from "./ui/badge";

export const PatientDetailsModal = ({ isOpen, onClose, patient }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Patient Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="flex items-start space-x-4">
            <div className="relative">
              <Avatar className="h-20 w-20">
                <AvatarFallback className="text-lg bg-primary text-primary-foreground">
                  {patient.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <Badge className="absolute -bottom-1 -right-1 bg-success text-white text-xs px-2">
                Active
              </Badge>
            </div>

            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground">{patient.name}</h3>
              <p className="text-muted-foreground mb-2">Patient ID: {patient.patientId}</p>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Date of Birth:</span>
                  <p className="font-medium">{patient.dateOfBirth} ({patient.age} years old)</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Gender:</span>
                  <p className="font-medium">{patient.gender}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Blood Type:</span>
                  <p className="font-medium">{patient.bloodType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Marital Status:</span>
                  <p className="font-medium">{patient.maritalStatus}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Contact Information</h4>

              <div className="flex items-center space-x-3 text-sm">
                <MdPhone className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">{patient.phone}</span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <MdEmail className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">{patient.email}</span>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <MdLocationOn className="text-muted-foreground h-4 w-4" />
                <span className="text-muted-foreground">{patient.address}</span>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Additional Information</h4>

              <div className="flex items-center space-x-3 text-sm">
                <MdWork className="text-muted-foreground h-4 w-4" />
                <div>
                  <span className="text-muted-foreground">Occupation:</span>
                  <p className="font-medium">{patient.occupation}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-sm">
                <MdLanguage className="text-muted-foreground h-4 w-4" />
                <div>
                  <span className="text-muted-foreground">Language:</span>
                  <p className="font-medium">{patient.language}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
