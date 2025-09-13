import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface TeamMember {
  id: string;
  name: string;
  position: string;
  avatar_url?: string;
  description?: string;
  display_order: number;
  is_active: boolean;
}

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  // Tạo initials từ tên
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardContent className="p-6 text-center">
        <Avatar className="w-24 h-24 mx-auto mb-4">
          {member.avatar_url ? (
            <AvatarImage 
              src={member.avatar_url} 
              alt={member.name} 
            />
          ) : null}
          <AvatarFallback className="text-lg font-bold bg-primary text-primary-foreground">
            {getInitials(member.name)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="font-bold text-lg mb-2">{member.name}</h3>
        
        <p className="text-primary font-medium mb-2">{member.position}</p>
        
        {member.description && (
          <p className="text-muted-foreground text-sm line-clamp-3">
            {member.description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}