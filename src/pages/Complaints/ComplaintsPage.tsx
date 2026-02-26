import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { EMAILJS_CONFIG } from '@/config/emailjs';

export default function ComplaintsPage() {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.firstName && user.lastName) {
      setName(`${user.firstName} ${user.lastName}`);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.PUBLIC_KEY) {
        throw new Error('EmailJS not configured.');
      }

      const userParams = {
        to_name: name,
        from_name: 'Support Team',
        to_email: email,
        reply_to: email,
        user_name: name,
        user_email: email,
        subject: subject,
        message: message,
      };

      const adminParams = {
        to_name: 'Admin',
        from_name: name,
        to_email: EMAILJS_CONFIG.ADMIN_EMAIL,
        reply_to: email,
        user_name: name,
        user_email: email,
        subject: subject,
        message: message,
      };

      // Send to user
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_USER,
        userParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      // Send to admin
      await emailjs.send(
        EMAILJS_CONFIG.SERVICE_ID,
        EMAILJS_CONFIG.TEMPLATE_ID_ADMIN,
        adminParams,
        EMAILJS_CONFIG.PUBLIC_KEY
      );

      setSuccess('Complaint submitted successfully! Check your email for confirmation.');
      setSubject('');
      setMessage('');
    } catch (err: any) {
      console.error('EmailJS Error:', err);
      setError(err.text || err.message || 'Failed to submit complaint.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <h1 className="text-3xl font-bold text-white">Complaints</h1>

        <Card className="border-gray-800 bg-gray-900">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <MessageSquare className="h-5 w-5" />
              Submit a Complaint
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm text-gray-400">Name</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Subject</label>
                <Input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Subject of your complaint"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400">Message</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white min-h-[150px]"
                  placeholder="Describe your complaint..."
                />
              </div>

              {success && (
                <div className="bg-green-900/50 border border-green-700 text-green-400 p-3 rounded">
                  {success}
                </div>
              )}

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-400 p-3 rounded">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Send className="mr-2 h-4 w-4" />
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
