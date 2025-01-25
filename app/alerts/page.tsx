'use client';

import { useState, useEffect } from 'react';
import { AlertForm } from '@/components/alerts/alert-form';
import { AlertList } from '@/components/alerts/alert-list';
import type { Alert } from '@/types/alerts';
import { toast } from '@/hooks/use-toast';
import axios from 'axios';

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAlerts = async () => {
      try {
        const {
          data: { alerts, message },
        } = await axios.get(`/api/alerts/list`);
        setAlerts(alerts);
      } catch (error: any) {
        console.log(error);
        toast({
          title: error?.response?.data?.error || 'An error occurred',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadAlerts();
  }, []);

  const handleCreateAlert = async (alert: Alert) => {
    try {
      setLoading(true);
      const data = await axios.post('/api/alerts/create', alert);
      toast({
        title: data.data.message,
        variant: 'default',
      });
      setAlerts([...alerts, data.data?.alert as Alert]);
    } catch (error: any) {
      console.log(error);
      toast({
        title: error?.response?.data?.error || 'An error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAlert = async (id: string) => {
    try {
      const data = await axios.post(`/api/alerts/update?id=${id}`, alert);
      toast({
        title: data.data.message,
        variant: 'default',
      });
      setAlerts(
        alerts.map((alert) =>
          alert._id === id ? { ...alert, active: !alert.active } : alert
        )
      );
    } catch (error: any) {
      console.log(error);
      toast({
        title: error?.response?.data?.error || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAlert = async (id: string) => {
    try {
      const data = await axios.delete(`/api/alerts/delete?id=${id}`);
      toast({
        title: data.data.message,
        variant: 'default',
      });
      setAlerts(alerts.filter((alert) => alert._id !== id));
    } catch (error: any) {
      console.log(error);
      toast({
        title: error?.response?.data?.error || 'An error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className='container py-8 max-w-4xl'>
      <div className='space-y-4 mb-8'>
        <h1 className='font-lexend text-3xl font-bold tracking-tight'>
          Alerts
        </h1>
        <p className='text-muted-foreground'>
          Set up automated alerts to monitor discussions across platforms and
          receive email notifications.
        </p>
      </div>

      <div className='space-y-8'>
        <AlertForm onSubmit={handleCreateAlert} />

        {!loading &&
          (alerts.length > 0 ? (
            <AlertList
              alerts={alerts}
              onToggle={handleToggleAlert}
              onDelete={handleDeleteAlert}
            />
          ) : (
            <div className='text-center py-8 text-muted-foreground'>
              No alerts created yet. Create one above to get started.
            </div>
          ))}
      </div>
    </div>
  );
}
