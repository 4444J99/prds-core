-- PRDS Core Database Schema
-- Run with: wrangler d1 migrations apply prds-core-api --local (for local) or --remote (for remote)

-- Users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  organization_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);

-- Prospects table
CREATE TABLE prospects (
  id TEXT PRIMARY KEY,
  company_name TEXT NOT NULL,
  company_name_normalized TEXT NOT NULL,
  state TEXT NOT NULL,
  industry TEXT,
  employee_count INTEGER DEFAULT 0,
  revenue_estimate TEXT DEFAULT '',
  score INTEGER NOT NULL DEFAULT 0,
  grade TEXT NOT NULL DEFAULT 'F',
  industry_risk_modifier REAL DEFAULT 1.0,
  state_modifier REAL DEFAULT 1.0,
  mca_adjacency_boost REAL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'review' CHECK (status IN ('qualified', 'review', 'disqualified')),
  last_enriched TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_prospects_state ON prospects(state);
CREATE INDEX idx_prospects_status ON prospects(status);
CREATE INDEX idx_prospects_score ON prospects(score DESC);
CREATE INDEX idx_prospects_company_normalized ON prospects(company_name_normalized);

-- UCC Filings table
CREATE TABLE ucc_filings (
  id TEXT PRIMARY KEY,
  external_id TEXT NOT NULL UNIQUE,
  filing_number TEXT NOT NULL,
  filing_type TEXT NOT NULL,
  filing_date TEXT NOT NULL,
  expiration_date TEXT,
  status TEXT NOT NULL,
  debtor_name TEXT NOT NULL,
  debtor_address TEXT,
  secured_party_name TEXT NOT NULL,
  secured_party_address TEXT,
  collateral TEXT,
  state TEXT NOT NULL,
  raw_data TEXT,
  created_at TEXT NOT NULL
);

CREATE INDEX idx_ucc_filings_state ON ucc_filings(state);
CREATE INDEX idx_ucc_filings_filing_date ON ucc_filings(filing_date);
CREATE INDEX idx_ucc_filings_debtor ON ucc_filings(debtor_name);
CREATE INDEX idx_ucc_filings_secured_party ON ucc_filings(secured_party_name);
CREATE INDEX idx_ucc_filings_external_id ON ucc_filings(external_id);

-- Prospect-UCC Filings junction
CREATE TABLE prospect_ucc_filings (
  prospect_id TEXT NOT NULL,
  ucc_filing_id TEXT NOT NULL,
  PRIMARY KEY (prospect_id, ucc_filing_id),
  FOREIGN KEY (prospect_id) REFERENCES prospects(id),
  FOREIGN KEY (ucc_filing_id) REFERENCES ucc_filings(id)
);

CREATE INDEX idx_prospect_ucc_prospect ON prospect_ucc_filings(prospect_id);
CREATE INDEX idx_prospect_ucc_filing ON prospect_ucc_filings(ucc_filing_id);

-- Deals table
CREATE TABLE deals (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'qualified' CHECK (stage IN ('qualified', 'proposal', 'negotiation', 'closed-won', 'closed-lost')),
  amount TEXT NOT NULL,
  probability INTEGER NOT NULL DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  owner TEXT DEFAULT '',
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id)
);

CREATE INDEX idx_deals_prospect ON deals(prospect_id);
CREATE INDEX idx_deals_stage ON deals(stage);

-- Documents table
CREATE TABLE documents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('UCC Report', 'Enrichment', 'Compliance', 'Scoring')),
  prospect_id TEXT NOT NULL,
  size TEXT DEFAULT '',
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('ready', 'processing', 'failed')),
  created_at TEXT NOT NULL,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id)
);

CREATE INDEX idx_documents_prospect ON documents(prospect_id);
CREATE INDEX idx_documents_status ON documents(status);

-- Users table (for auth)
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  company TEXT DEFAULT '',
  password_hash TEXT NOT NULL,
  tier TEXT NOT NULL DEFAULT 'free' CHECK (tier IN ('free', 'starter', 'professional', 'enterprise')),
  organization_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_organization ON users(organization_id);

-- Health scores history
CREATE TABLE health_scores (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  grade TEXT NOT NULL,
  trend TEXT CHECK (trend IN ('improving', 'stable', 'declining')),
  violations_count INTEGER DEFAULT 0,
  sentiment_score REAL,
  recorded_at TEXT NOT NULL,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id)
);

CREATE INDEX idx_health_scores_prospect ON health_scores(prospect_id);
CREATE INDEX idx_health_scores_recorded ON health_scores(recorded_at);

-- Enrichment results
CREATE TABLE enrichment_results (
  id TEXT PRIMARY KEY,
  prospect_id TEXT NOT NULL,
  sources TEXT NOT NULL, -- JSON
  signals TEXT NOT NULL, -- JSON
  confidence REAL NOT NULL,
  completed_at TEXT NOT NULL,
  FOREIGN KEY (prospect_id) REFERENCES prospects(id)
);

CREATE INDEX idx_enrichment_prospect ON enrichment_results(prospect_id);