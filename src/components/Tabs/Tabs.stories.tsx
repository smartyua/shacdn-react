import type { Story } from '@ladle/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs';

export const Default: Story = () => (
  <Tabs defaultValue="account" style={{ maxWidth: 420 }}>
    <TabsList>
      <TabsTrigger value="account">Account</TabsTrigger>
      <TabsTrigger value="password">Password</TabsTrigger>
    </TabsList>
    <TabsContent value="account">Manage your account settings.</TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
);
