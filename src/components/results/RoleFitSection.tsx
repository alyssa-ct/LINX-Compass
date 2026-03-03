import { RoleFitResults } from '@/lib/types';
import { colors } from '@/lib/constants';

interface RoleFitSectionProps {
  roleFits: RoleFitResults;
}

function RoleFitCard({ role }: { role: { roleName: string; roleFamily: string; fitScore: number; strengths: string[]; gaps: string[] } }) {
  const scoreColor = role.fitScore >= 75 ? '#16a34a' : role.fitScore >= 55 ? '#ca8a04' : colors.scarlet;

  return (
    <div className="rounded-lg p-4" style={{ backgroundColor: colors.white, border: '1px solid #e5e5e5' }}>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h4 className="text-sm font-bold" style={{ color: colors.indigo }}>{role.roleName}</h4>
          <span className="text-xs" style={{ color: colors.slate }}>{role.roleFamily}</span>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold" style={{ color: scoreColor }}>{role.fitScore}</span>
          <span className="text-xs block" style={{ color: colors.slate }}>fit score</span>
        </div>
      </div>

      {role.strengths.length > 0 && (
        <div className="mt-2">
          <span className="text-xs font-medium" style={{ color: '#16a34a' }}>Strengths: </span>
          <span className="text-xs" style={{ color: colors.charcoal }}>{role.strengths.join(', ')}</span>
        </div>
      )}

      {role.gaps.length > 0 && (
        <div className="mt-1">
          <span className="text-xs font-medium" style={{ color: colors.scarlet }}>Gaps: </span>
          <span className="text-xs" style={{ color: colors.charcoal }}>{role.gaps.join(', ')}</span>
        </div>
      )}
    </div>
  );
}

export default function RoleFitSection({ roleFits }: RoleFitSectionProps) {
  return (
    <div>
      {roleFits.topFits.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3" style={{ color: colors.indigo }}>
            Top Fit Roles
          </h3>
          <div className="space-y-3">
            {roleFits.topFits.map(role => (
              <RoleFitCard key={role.roleId} role={role} />
            ))}
          </div>
        </div>
      )}

      {roleFits.stretchFits.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-3" style={{ color: colors.indigo }}>
            Stretch Fit Roles
          </h3>
          <p className="text-xs mb-3" style={{ color: colors.slate }}>
            These roles are within reach but have some areas for development.
          </p>
          <div className="space-y-3">
            {roleFits.stretchFits.map(role => (
              <RoleFitCard key={role.roleId} role={role} />
            ))}
          </div>
        </div>
      )}

      {roleFits.avoidForNow.length > 0 && (
        <div>
          <h3 className="text-lg font-bold mb-3" style={{ color: colors.indigo }}>
            Avoid for Now
          </h3>
          <p className="text-xs mb-3" style={{ color: colors.slate }}>
            These roles have significant gaps that would need to be addressed before pursuing.
          </p>
          <div className="space-y-3">
            {roleFits.avoidForNow.map(role => (
              <RoleFitCard key={role.roleId} role={role} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
