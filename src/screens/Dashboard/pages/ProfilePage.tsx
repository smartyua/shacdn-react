import { useState } from 'react';
import { Camera, KeyRound, Shield } from 'lucide-react';

import { Avatar, AvatarFallback } from '../../../components/Avatar/Avatar';
import { Badge } from '../../../components/Badge/Badge';
import { Button } from '../../../components/Button/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../components/Card/Card';
import { Field, FieldDescription, FieldLabel } from '../../../components/Field/Field';
import { Form, FormField } from '../../../components/Form/Form';
import { Input } from '../../../components/Input/Input';
import { InputOTP } from '../../../components/InputOTP/InputOTP';
import { Label } from '../../../components/Label/Label';
import { Separator } from '../../../components/Separator/Separator';
import { Switch } from '../../../components/Switch/Switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/Tabs/Tabs';
import { useToastActions } from '../../../components/Toast/Toast';

import { PROFILE_USER } from '../accountData';
import { PageHeader } from '../components/PageHeader';
import styles from '../Dashboard.module.scss';

export const ProfilePage = () => {
  const { addToast } = useToastActions();
  const [otp, setOtp] = useState('');
  const [emailDigest, setEmailDigest] = useState(true);
  const [productTips, setProductTips] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);

  return (
    <>
      <PageHeader
        title="Profile"
        lead="Compose Tabs + Card + Form for a personal account surface — identity, security, and notifications."
        meta={`${PROFILE_USER.role} · joined ${PROFILE_USER.joined}`}
        actions={
          <Button
            type="button"
            onClick={() =>
              addToast({ title: 'Profile saved', description: 'Your account details were updated.' })
            }
          >
            Save changes
          </Button>
        }
      />

      <section className={styles.section} aria-labelledby="profile-identity-heading">
        <div className={styles.kpiGrid}>
          <Card>
            <CardHeader>
              <CardTitle id="profile-identity-heading">Identity</CardTitle>
              <CardDescription>Avatar, role, and contact used across the workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className={styles.formGrid}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Avatar size="lg">
                    <AvatarFallback>{PROFILE_USER.initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600 }}>{PROFILE_USER.name}</p>
                    <p className={styles.panelDescription} style={{ marginTop: '0.25rem' }}>
                      {PROFILE_USER.title}
                    </p>
                    <Badge variant="secondary" style={{ marginTop: '0.5rem' }}>
                      {PROFILE_USER.role}
                    </Badge>
                  </div>
                </div>
                <Button type="button" variant="outline" size="sm">
                  <Camera size={14} aria-hidden />
                  Change photo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Session</CardTitle>
              <CardDescription>Locale and timezone drive dates in tables and invoices.</CardDescription>
            </CardHeader>
            <CardContent className={styles.formGrid}>
              <Field>
                <FieldLabel htmlFor="profile-tz">Timezone</FieldLabel>
                <Input id="profile-tz" defaultValue={PROFILE_USER.timezone} readOnly />
                <FieldDescription>Inherited from browser; override in Settings.</FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-locale">Locale</FieldLabel>
                <Input id="profile-locale" defaultValue={PROFILE_USER.locale} readOnly />
              </Field>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className={styles.section} aria-labelledby="profile-tabs-heading">
        <h2 id="profile-tabs-heading" className={styles.sectionHeading}>
          Account sections
        </h2>
        <p className={styles.sectionLead}>
          Tabs keep related forms on one route — no separate pages for each preference group.
        </p>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Name and contact shown on invoices and invites.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addToast({ title: 'General prefs saved' });
                  }}
                >
                  <div className={styles.formGrid}>
                    <FormField>
                      <Label htmlFor="profile-name">Full name</Label>
                      <Input id="profile-name" defaultValue={PROFILE_USER.name} />
                    </FormField>
                    <FormField>
                      <Label htmlFor="profile-email">Email</Label>
                      <Input id="profile-email" type="email" defaultValue={PROFILE_USER.email} />
                    </FormField>
                    <FormField>
                      <Label htmlFor="profile-phone">Phone</Label>
                      <Input id="profile-phone" type="tel" defaultValue={PROFILE_USER.phone} />
                    </FormField>
                    <FormField>
                      <Label htmlFor="profile-title">Title</Label>
                      <Input id="profile-title" defaultValue={PROFILE_USER.title} />
                    </FormField>
                  </div>
                  <CardFooter style={{ padding: '1rem 0 0', border: 'none' }}>
                    <Button type="submit">Update profile</Button>
                  </CardFooter>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Shield size={16} aria-hidden />
                    Two-factor authentication
                  </span>
                </CardTitle>
                <CardDescription>Confirm a code from your authenticator app.</CardDescription>
              </CardHeader>
              <CardContent className={styles.formGrid}>
                <Field>
                  <FieldLabel>Verification code</FieldLabel>
                  <InputOTP value={otp} onChange={setOtp} length={6} />
                  <FieldDescription>Demo OTP — any 6 digits enable the button.</FieldDescription>
                </Field>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <Button
                    type="button"
                    disabled={otp.length < 6}
                    onClick={() =>
                      addToast({
                        title: '2FA enabled',
                        description: 'Authenticator challenge will be required on next login.',
                      })
                    }
                  >
                    Enable 2FA
                  </Button>
                  <Button type="button" variant="outline">
                    <KeyRound size={14} aria-hidden />
                    View recovery codes
                  </Button>
                </div>
                <Separator />
                <div className={styles.surfacePanel}>
                  <p className={styles.metricTileLabel}>Active sessions</p>
                  <p className={styles.panelDescription}>
                    Berlin · Chrome · current · {PROFILE_USER.timezone}
                  </p>
                  <Button type="button" variant="destructive" size="sm" className={styles.panelAction}>
                    Sign out other sessions
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Email &amp; product alerts</CardTitle>
                <CardDescription>Switch + Label pairs for binary preferences.</CardDescription>
              </CardHeader>
              <CardContent className={styles.formGrid}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <Label htmlFor="notif-digest">Weekly digest</Label>
                    <p className={styles.panelDescription}>Summary of requests and invoices.</p>
                  </div>
                  <Switch
                    id="notif-digest"
                    checked={emailDigest}
                    onChange={(e) => setEmailDigest(e.target.checked)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <Label htmlFor="notif-tips">Product tips</Label>
                    <p className={styles.panelDescription}>Occasional feature announcements.</p>
                  </div>
                  <Switch
                    id="notif-tips"
                    checked={productTips}
                    onChange={(e) => setProductTips(e.target.checked)}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
                  <div>
                    <Label htmlFor="notif-security">Security alerts</Label>
                    <p className={styles.panelDescription}>Logins from new devices and API key changes.</p>
                  </div>
                  <Switch
                    id="notif-security"
                    checked={securityAlerts}
                    onChange={(e) => setSecurityAlerts(e.target.checked)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  type="button"
                  onClick={() => addToast({ title: 'Notification prefs saved' })}
                >
                  Save notifications
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};
