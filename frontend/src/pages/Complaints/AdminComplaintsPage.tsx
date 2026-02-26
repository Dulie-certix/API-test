import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageSquare, Send, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Complaint {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Replied';
  createdAt: string;
}

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [sending, setSending] = useState<string | null>(null);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/complaints', {
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setComplaints(data);
      }
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (complaintId: string, email: string) => {
    const replyMessage = replyText[complaintId];
    if (!replyMessage?.trim()) return;

    setSending(complaintId);
    try {
      const response = await fetch('http://localhost:5000/api/complaint/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ complaintId, replyMessage }),
      });

      if (response.ok) {
        setReplyText({ ...replyText, [complaintId]: '' });
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    } finally {
      setSending(null);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Complaints Management</h1>
          <Badge variant="outline" className="border-blue-400 text-blue-400">
            {complaints.length} Total
          </Badge>
        </div>

        {loading ? (
          <div className="text-gray-400">Loading complaints...</div>
        ) : complaints.length === 0 ? (
          <Card className="border-gray-800 bg-gray-900">
            <CardContent className="p-6 text-center text-gray-400">
              No complaints yet
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => (
              <Card key={complaint._id} className="border-gray-800 bg-gray-900">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <MessageSquare className="h-5 w-5" />
                        {complaint.name}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-400">{complaint.email}</span>
                      </div>
                    </div>
                    <Badge
                      variant={complaint.status === 'Replied' ? 'default' : 'outline'}
                      className={
                        complaint.status === 'Replied'
                          ? 'bg-green-900 text-green-400'
                          : 'border-yellow-400 text-yellow-400'
                      }
                    >
                      {complaint.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    {new Date(complaint.createdAt).toLocaleString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-400 mb-2">Subject:</p>
                    <p className="text-white bg-gray-800 p-3 rounded">
                      {complaint.subject}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-400 mb-2">Message:</p>
                    <p className="text-white bg-gray-800 p-3 rounded">
                      {complaint.message}
                    </p>
                  </div>

                  {complaint.status === 'Pending' && (
                    <div className="space-y-2">
                      <Textarea
                        value={replyText[complaint._id] || ''}
                        onChange={(e) =>
                          setReplyText({ ...replyText, [complaint._id]: e.target.value })
                        }
                        placeholder="Type your reply..."
                        className="bg-gray-800 border-gray-700 text-white"
                      />
                      <Button
                        onClick={() => handleReply(complaint._id, complaint.email)}
                        disabled={!replyText[complaint._id]?.trim() || sending === complaint._id}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Send className="mr-2 h-4 w-4" />
                        {sending === complaint._id ? 'Sending...' : 'Send Reply'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
