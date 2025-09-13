'use client';

import { TeamMemberCard } from "@/components/about/team-member-card";
import { useTeamMembers } from "@/hooks/use-team-members";
import { Users, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function AboutTeam() {
  const { teamMembers, loading, error } = useTeamMembers();

  if (loading) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những người tài năng đằng sau sự thành công của CodeMarket
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-64 bg-gray-200 rounded-lg"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những người tài năng đằng sau sự thành công của CodeMarket
            </p>
          </div>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Không thể tải thông tin đội ngũ. Vui lòng thử lại sau.
            </AlertDescription>
          </Alert>
        </div>
      </section>
    );
  }

  if (teamMembers.length === 0) {
    return (
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Những người tài năng đằng sau sự thành công của CodeMarket
            </p>
          </div>
          <div className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">
              Thông tin đội ngũ sẽ được cập nhật sớm.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Đội ngũ của chúng tôi</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Những người tài năng đằng sau sự thành công của CodeMarket
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <TeamMemberCard key={member.id} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
} 