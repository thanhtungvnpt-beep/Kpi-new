import React from 'react';
import { ValidationRulesCatalog } from './ValidationRulesCatalog';
import {
  ValidationRule,
  RuleCategory,
  RuleGroupExecutionSummary,
  RuleParameterConfig,
} from '../types';
import { RULE_GROUP_SUMMARIES } from '../data/enterpriseDataQualityData';

export interface ValidationEngineTabProps {
  rules: ValidationRule[];
  groupSummaries?: RuleGroupExecutionSummary[];
  onToggleRule: (ruleId: string) => void;
  onToggleGroup?: (group: RuleCategory, active: boolean) => void;
  onUpdateRuleParameters?: (ruleId: string, updatedParams: RuleParameterConfig[]) => void;
  onDryRunValidation: () => void;
  isDryRunning?: boolean;
  onShowToast?: (msg: string) => void;
}

export const ValidationEngineTab: React.FC<ValidationEngineTabProps> = ({
  rules,
  groupSummaries = RULE_GROUP_SUMMARIES,
  onToggleRule,
  onToggleGroup,
  onUpdateRuleParameters,
  onDryRunValidation,
  isDryRunning = false,
  onShowToast = () => {},
}) => {
  return (
    <ValidationRulesCatalog
      rules={rules}
      groupSummaries={groupSummaries}
      onToggleRule={onToggleRule}
      onToggleGroup={onToggleGroup}
      onUpdateRuleParameters={onUpdateRuleParameters}
      onDryRunValidation={onDryRunValidation}
      isDryRunning={isDryRunning}
      onShowToast={onShowToast}
    />
  );
};

export { ValidationRulesCatalog };
