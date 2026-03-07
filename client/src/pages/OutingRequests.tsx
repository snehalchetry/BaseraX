import { useState, useEffect } from 'react';
import api from '../api/client';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

export default function OutingRequests() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    // Form state
    const [form, setForm] = useState({
        date: '',
        timeFrom: '',
        timeTo: '',
        destination: '',
        purpose: '',
        emergencyContact: '',
    });

    const fetchRequests = async () => {
        try {
            const { data } = await api.get('/outings');
            setRequests(data.data?.outings || []);
        } catch (err) {
            console.error('Failed to fetch outings', err);
            setRequests([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, []);

    const handleNewRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/outings', form);
            showToast('Outing request submitted successfully!', 'success');
            setShowNewModal(false);
            setForm({ date: '', timeFrom: '', timeTo: '', destination: '', purpose: '', emergencyContact: '' });
            fetchRequests();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to submit request', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewDetails = (req: any) => {
        setSelectedRequest(req);
        setShowDetailModal(true);
    };

    if (loading) return (
        <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-3 border-brand-primary/30 border-t-brand-primary rounded-full animate-spin"></div>
        </div>
    );

    return (
        <>
            <div className="mb-6 flex justify-between items-center animate-fade-slide-in">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Outing Requests</h1>
                    <p className="text-sm text-gray-500 font-medium">Manage and track all outing passes.</p>
                </div>
                <button onClick={() => setShowNewModal(true)} className="btn btn-primary shadow-md shadow-brand-primary/20 flex gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    New Request
                </button>
            </div>

            <div className="card animate-fade-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Date & Time</th>
                                <th className="px-6 py-4">Destination</th>
                                <th className="px-6 py-4">Purpose</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {requests.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                                        <span className="material-symbols-outlined text-[40px] text-gray-300 block mb-2">directions_walk</span>
                                        No outing requests found. Click "New Request" to create one.
                                    </td>
                                </tr>
                            ) : (
                                requests.map((req: any) => (
                                    <tr key={req._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{new Date(req.date).toLocaleDateString()}</div>
                                            <div className="text-xs text-gray-500 mt-1 font-medium">{req.timeFrom} - {req.timeTo}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">{req.destination}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 max-w-[250px] truncate" title={req.purpose}>{req.purpose}</td>
                                        <td className="px-6 py-4">
                                            <Badge status={req.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleViewDetails(req)} className="text-brand-primary hover:text-[#7a0e12] font-semibold text-sm transition-colors py-1 px-3 rounded-md hover:bg-red-50">
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* New Request Modal */}
            <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="New Outing Request">
                <form onSubmit={handleNewRequest} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Date</label>
                        <input type="date" required value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="input-field" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Time From</label>
                            <input type="time" required value={form.timeFrom} onChange={e => setForm({ ...form, timeFrom: e.target.value })} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Time To</label>
                            <input type="time" required value={form.timeTo} onChange={e => setForm({ ...form, timeTo: e.target.value })} className="input-field" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Destination</label>
                        <input type="text" required placeholder="Where are you going?" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value })} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Purpose</label>
                        <textarea required placeholder="Reason for outing..." value={form.purpose} onChange={e => setForm({ ...form, purpose: e.target.value })} className="input-field min-h-[80px] resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Emergency Contact (optional)</label>
                        <input type="tel" placeholder="Phone number" value={form.emergencyContact} onChange={e => setForm({ ...form, emergencyContact: e.target.value })} className="input-field" />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={() => setShowNewModal(false)} className="btn btn-secondary flex-1">Cancel</button>
                        <button type="submit" disabled={submitting} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Submit<span className="material-symbols-outlined text-[16px]">send</span></>}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Detail Modal */}
            <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Outing Request Details">
                {selectedRequest && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date</div>
                                <div className="text-sm font-semibold text-gray-900">{new Date(selectedRequest.date).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Time</div>
                                <div className="text-sm font-semibold text-gray-900">{selectedRequest.timeFrom} - {selectedRequest.timeTo}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Destination</div>
                                <div className="text-sm font-semibold text-gray-900">{selectedRequest.destination}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                <Badge status={selectedRequest.status} />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Purpose</div>
                            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedRequest.purpose}</div>
                        </div>
                        {selectedRequest.emergencyContact && (
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Emergency Contact</div>
                                <div className="text-sm font-semibold text-gray-900">{selectedRequest.emergencyContact}</div>
                            </div>
                        )}
                        {selectedRequest.passCode && (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-center">
                                <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">Gate Pass Code</div>
                                <div className="text-2xl font-bold text-emerald-800 tracking-widest">{selectedRequest.passCode}</div>
                            </div>
                        )}
                        <div className="pt-2">
                            <button onClick={() => setShowDetailModal(false)} className="btn btn-secondary w-full">Close</button>
                        </div>
                    </div>
                )}
            </Modal>
        </>
    );
}
