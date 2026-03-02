// ─── Enums & Literal Types ───────────────────────────────────────────────────

export type AssessmentVersion = 'light' | 'standard' | 'max';

export type QuestionKeying = 'F' | 'R' | 'O';

export type LikertResponse = 1 | 2 | 3 | 4 | 5;

export type SessionStage =
  | 'preview'
  | 'email-capture'
  | 'preview-results'
  | 'upgrade'
  | 'assessment'
  | 'results';

export type DimensionId =
  | 'responsibility'
  | 'control'
  | 'feelings'
  | 'risk-orientation'
  | 'energy-capacity'
  | 'communication'
  | 'world-outlook'
  | 'need-for-structure'
  | 'logical-thinking'
  | 'creative-thinking'
  | 'anxiety'
  | 'self-esteem'
  | 'motivation-values'
  | 'learning-adaptability'
  | 'integrity';

export type ScoreBand = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

export type RoleFitCategory = 'top-fit' | 'stretch-fit' | 'avoid-for-now';

export type RoleFamily =
  | 'sales'
  | 'marketing'
  | 'operations'
  | 'finance'
  | 'admin'
  | 'leadership'
  | 'entrepreneurship'
  | 'hybrid';

// ─── Questions ───────────────────────────────────────────────────────────────

export interface CompassQuestion {
  id: string;                // e.g. "responsibility-001"
  dimensionId: DimensionId;
  text: string;
  keying: QuestionKeying;    // F = Forward, R = Reverse, O = Overuse
  orderIndex: number;        // 1-50 within dimension
}

// ─── Answers ─────────────────────────────────────────────────────────────────

export interface AnsweredQuestion {
  questionId: string;
  response: LikertResponse;
  answeredAt: string;        // ISO timestamp
}

// ─── User Info ───────────────────────────────────────────────────────────────

export interface UserInfo {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
}

// ─── Session ─────────────────────────────────────────────────────────────────

export interface PaymentInfo {
  status: 'pending' | 'completed' | 'failed';
  stripeCheckoutSessionId?: string;
  amount: number;            // in cents
  paidAt?: string;           // ISO timestamp
}

export interface AssessmentSession {
  id: string;
  userId?: string;
  version: AssessmentVersion | null;
  user: UserInfo | null;
  stage: SessionStage;
  previewQuestionIds: string[];
  fullQuestionIds: string[];
  previewAnswers: AnsweredQuestion[];
  fullAnswers: AnsweredQuestion[];
  payment: PaymentInfo | null;
  assignedBy?: string;           // admin userId — null for self-service
  results?: AssessmentResults;
  createdAt: string;
  updatedAt: string;
}

// ─── Scoring Results ─────────────────────────────────────────────────────────

export interface DimensionScore {
  dimensionId: DimensionId;
  rawScore: number;          // 1-10 scale
  band: ScoreBand;
  overuseIndex: number | null;  // null if no O-keyed items answered
  overuseFlag: boolean;
  interpretation: string;    // band-specific text from spec
}

export interface CrossDimensionPairing {
  id: string;                // e.g. "control-feelings"
  dimensionA: DimensionId;
  dimensionB: DimensionId;
  label: string;             // e.g. "Emotional Regulation"
  pattern: string;           // e.g. "High Control + Low Feelings"
  insight: string;           // narrative from spec
}

export interface DisqualifierFlag {
  id: string;
  label: string;
  description: string;
  triggered: boolean;
  details: string;           // explanation of what triggered it
}

export interface AssessmentResults {
  dimensionScores: DimensionScore[];
  crossDimensionPairings: CrossDimensionPairing[];
  universalDisqualifiers: DisqualifierFlag[];
  roleFits: RoleFitResults;
  archetype?: ArchetypeResult;
}

// ─── Role-Fit ────────────────────────────────────────────────────────────────

export interface DimensionDemand {
  dimensionId: DimensionId;
  minScore: number;          // minimum acceptable score
  idealScore: number;        // ideal target score
  weight: number;            // 0-1, importance weight
  isDisqualifier: boolean;   // if below min, disqualifies
}

export interface RoleTemplate {
  id: string;                // e.g. "sales-hunter"
  family: RoleFamily;
  name: string;              // e.g. "Sales Hunter"
  description: string;
  demands: DimensionDemand[];
}

export interface RoleFitResult {
  roleId: string;
  roleName: string;
  roleFamily: RoleFamily;
  fitScore: number;          // 0-100
  category: RoleFitCategory;
  strengths: string[];       // dimensions where candidate excels
  gaps: string[];            // dimensions below minimum
}

export interface RoleFitResults {
  topFits: RoleFitResult[];
  stretchFits: RoleFitResult[];
  avoidForNow: RoleFitResult[];
}

// ─── Archetypes ─────────────────────────────────────────────────────────────

export type ArchetypeId =
  | 'driver'
  | 'strategist'
  | 'builder'
  | 'innovator'
  | 'connector'
  | 'anchor'
  | 'catalyst'
  | 'analyst'
  | 'empath'
  | 'maverick';

export type PillarId = 'drive' | 'thinking' | 'social-emotional' | 'values';

export interface PillarScore {
  pillarId: PillarId;
  average: number;
  dimensions: { dimensionId: DimensionId; score: number }[];
}

export interface ArchetypeMatchRule {
  /** Dimension or pillar to check */
  target: DimensionId | PillarId;
  /** 'gte' = score >= value, 'lte' = score <= value, 'range' = between min/max */
  op: 'gte' | 'lte' | 'range';
  value: number;
  maxValue?: number;  // only for 'range'
  /** How much this rule contributes to overall match (0-1) */
  weight: number;
}

export interface ArchetypeDefinition {
  id: ArchetypeId;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
  watchOuts: string[];
  compatibleRoleFamilies: RoleFamily[];
  matchRules: ArchetypeMatchRule[];
}

export interface ArchetypeResult {
  primary: {
    archetypeId: ArchetypeId;
    name: string;
    tagline: string;
    description: string;
    strengths: string[];
    watchOuts: string[];
    compatibleRoleFamilies: RoleFamily[];
    confidence: number;   // 0-1
  };
  secondary: {
    archetypeId: ArchetypeId;
    name: string;
    tagline: string;
    confidence: number;
  } | null;
  pillarScores: PillarScore[];
}

// ─── Version Config ──────────────────────────────────────────────────────────

export interface VersionConfig {
  id: AssessmentVersion;
  name: string;
  questionsPerDimension: number;
  totalQuestions: number;
  previewQuestions: number;   // always 30 (2 per dimension)
  paidQuestions: number;      // total minus preview
  priceUsd: number;
  priceCents: number;
  features: string[];
}

// ─── Dimension Definition ────────────────────────────────────────────────────

export interface DimensionDefinition {
  id: DimensionId;
  name: string;
  shortDescription: string;
  lowLabel: string;          // what a low score means
  highLabel: string;         // what a high score means
  healthyRange: [number, number];  // e.g. [4, 7]
  bandInterpretations: Record<ScoreBand, string>;
}

// ─── Storage Interface ───────────────────────────────────────────────────────

export interface SessionStore {
  create(session: AssessmentSession): Promise<void>;
  read(id: string): Promise<AssessmentSession | null>;
  readAll(): Promise<AssessmentSession[]>;
  update(id: string, updates: Partial<AssessmentSession>): Promise<void>;
}

// ─── Auth / User Types ──────────────────────────────────────────────────────

export type UserRole = 'user' | 'client' | 'admin';

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  company: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// ─── Client Assignment (Admin-Managed) ──────────────────────────────────────

export interface ClientAssignment {
  id: string;
  clientUserId: string;
  assignedBy: string;            // admin userId
  version: AssessmentVersion;
  sessionId?: string;            // created when client starts
  deadline?: string;             // ISO date
  notes?: string;                // admin notes
  status: 'pending' | 'in-progress' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface AssignmentStore {
  create(assignment: ClientAssignment): Promise<void>;
  read(id: string): Promise<ClientAssignment | null>;
  readAll(): Promise<ClientAssignment[]>;
  findByClient(clientUserId: string): Promise<ClientAssignment[]>;
  findByAdmin(adminUserId: string): Promise<ClientAssignment[]>;
  update(id: string, updates: Partial<ClientAssignment>): Promise<void>;
  delete(id: string): Promise<void>;
}

export interface UserStore {
  create(user: User): Promise<void>;
  findByEmail(email: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  readAll(): Promise<User[]>;
  update(id: string, updates: Partial<User>): Promise<void>;
}
