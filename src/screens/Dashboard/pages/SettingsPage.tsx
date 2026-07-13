import { useState } from 'react';
import { Shield } from 'lucide-react';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../../components/Accordion/Accordion';
import { Button } from '../../../components/Button/Button';
import { Calendar } from '../../../components/Calendar/Calendar';
import { Checkbox } from '../../../components/Checkbox/Checkbox';
import { Combobox } from '../../../components/Combobox/Combobox';
import { DirectionProvider } from '../../../components/Direction/Direction';
import { Field, FieldDescription, FieldLabel } from '../../../components/Field/Field';
import { Form, FormField } from '../../../components/Form/Form';
import { Input } from '../../../components/Input/Input';
import { InputOTP } from '../../../components/InputOTP/InputOTP';
import { Label } from '../../../components/Label/Label';
import { RadioGroup, RadioGroupItem } from '../../../components/RadioGroup/RadioGroup';
import { Select } from '../../../components/Select/Select';
import { Slider } from '../../../components/Slider/Slider';
import { Switch } from '../../../components/Switch/Switch';
import { Textarea } from '../../../components/Textarea/Textarea';
import { useToastActions } from '../../../components/Toast/Toast';
import { TypographyMuted } from '../../../components/Typography/Typography';

import { PageHeader } from '../components/PageHeader';
import styles from '../Dashboard.module.scss';

export const SettingsPage = () => {
  const { addToast } = useToastActions();
  const [budget, setBudget] = useState(65);
  const [otp, setOtp] = useState('');
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [apiAccess, setApiAccess] = useState(false);
  const [plan, setPlan] = useState('pro');
  const [density, setDensity] = useState('comfortable');
  const [calDate, setCalDate] = useState<Date | undefined>(() => new Date());

  return (
    <>
      <PageHeader
        title="Settings"
        lead="Configure billing, alerts, and display preferences. Changes apply to all team members."
        meta="Last saved Jul 10, 2026 by Admin User"
      />

      <section className={styles.settingsSection} aria-labelledby="settings-form-heading">
        <h2 id="settings-form-heading" className={styles.sectionHeading}>
          Workspace preferences
        </h2>
        <p className={styles.sectionLead}>Grouped by category — expand each section to edit.</p>

        <div className={styles.settingsSurface}>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              addToast({ title: 'Settings saved', description: 'Your preferences have been updated.' });
            }}
          >
            <Accordion type="multiple" defaultValue={['general', 'notifications']} className={styles.settingsAccordionRoot}>
              <AccordionItem value="general" className={styles.settingsAccordionItem}>
                <AccordionTrigger>General</AccordionTrigger>
                <AccordionContent>
                  <div className={styles.formGrid}>
                    <FormField>
                      <Label htmlFor="ws-name">Workspace name</Label>
                      <Input id="ws-name" defaultValue="Acme Analytics" />
                    </FormField>
                    <FormField>
                      <Label htmlFor="ws-email">Billing email</Label>
                      <Input id="ws-email" type="email" defaultValue="billing@acme.io" />
                    </FormField>
                    <FormField>
                      <Label htmlFor="ws-plan">Plan</Label>
                      <Select id="ws-plan" value={plan} onChange={(e) => setPlan(e.target.value)}>
                        <option value="free">Free — up to 3 users</option>
                        <option value="pro">Pro — $49/mo, unlimited reports</option>
                        <option value="enterprise">Enterprise — SSO &amp; SLA</option>
                      </Select>
                    </FormField>
                    <FormField>
                      <Label htmlFor="ws-timezone">Timezone</Label>
                      <Combobox
                        options={[
                          { value: 'utc', label: 'UTC' },
                          { value: 'est', label: 'Eastern (EST)' },
                          { value: 'pst', label: 'Pacific (PST)' },
                        ]}
                        defaultValue="utc"
                        placeholder="Select timezone…"
                      />
                    </FormField>
                    <div className={styles.formFull}>
                      <Label htmlFor="ws-notes">Internal notes</Label>
                      <Textarea id="ws-notes" rows={3} placeholder="Visible only to workspace admins…" />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="notifications" className={styles.settingsAccordionItem}>
                <AccordionTrigger>Notifications &amp; alerts</AccordionTrigger>
                <AccordionContent>
                  <div className={styles.formGrid}>
                    <div className={styles.formFull}>
                      <Label>Alert threshold</Label>
                      <div className={styles.sliderField}>
                        <Slider value={budget} onValueChange={setBudget} min={0} max={100} />
                        <TypographyMuted>Notify when usage reaches {budget}% of the monthly API quota</TypographyMuted>
                      </div>
                    </div>
                    <div className={styles.formFull}>
                      <div className={styles.fieldRow}>
                        <Checkbox
                          id="ws-terms"
                          checked={emailAlerts}
                          onChange={(e) => setEmailAlerts(e.target.checked)}
                        />
                        <Label htmlFor="ws-terms">Send email when thresholds are crossed</Label>
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="security" className={styles.settingsAccordionItem}>
                <AccordionTrigger>Security &amp; API</AccordionTrigger>
                <AccordionContent>
                  <div className={styles.formGrid}>
                    <div className={styles.formFull}>
                      <div className={styles.fieldRow}>
                        <Switch id="ws-api" checked={apiAccess} onChange={(e) => setApiAccess(e.target.checked)} />
                        <Label htmlFor="ws-api">Enable REST API access for integrations</Label>
                      </div>
                    </div>
                    <div className={styles.formFull}>
                      <Field>
                        <FieldLabel>Two-factor authentication</FieldLabel>
                        <InputOTP length={6} value={otp} onChange={setOtp} />
                        <FieldDescription>
                          Enter the 6-digit code from your authenticator app to verify changes
                        </FieldDescription>
                      </Field>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="display" className={styles.settingsAccordionItem}>
                <AccordionTrigger>Display &amp; scheduling</AccordionTrigger>
                <AccordionContent>
                  <div className={styles.formGrid}>
                    <div className={styles.formFull}>
                      <Label>Table density</Label>
                      <RadioGroup value={density} onValueChange={setDensity}>
                        <div className={styles.fieldRow}>
                          <RadioGroupItem value="compact" id="density-compact" />
                          <Label htmlFor="density-compact">Compact — more rows per screen</Label>
                        </div>
                        <div className={styles.fieldRow}>
                          <RadioGroupItem value="comfortable" id="density-comfortable" />
                          <Label htmlFor="density-comfortable">Comfortable — balanced spacing</Label>
                        </div>
                        <div className={styles.fieldRow}>
                          <RadioGroupItem value="spacious" id="density-spacious" />
                          <Label htmlFor="density-spacious">Spacious — extra padding for readability</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className={styles.formFull}>
                      <Field>
                        <FieldLabel>Report delivery schedule</FieldLabel>
                        <Calendar selected={calDate} onSelect={setCalDate} />
                        <FieldDescription>Used for scheduling automated report delivery</FieldDescription>
                      </Field>
                    </div>
                    <div className={styles.formFull}>
                      <Label>RTL layout preview</Label>
                      <DirectionProvider dir="rtl" className={styles.directionDemo}>
                        <p>Buttons and text flow right-to-left in RTL locales.</p>
                        <div className={styles.directionRow}>
                          <Button size="sm" variant="outline">
                            First
                          </Button>
                          <Button size="sm" variant="outline">
                            Second
                          </Button>
                        </div>
                      </DirectionProvider>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <div className={styles.formActions}>
              <Button type="submit" size="sm">
                <Shield size={14} aria-hidden />
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  addToast({ title: 'Discarded', description: 'Changes were not saved.', variant: 'destructive' })
                }
              >
                Discard
              </Button>
            </div>
          </Form>
        </div>
      </section>
    </>
  );
};
