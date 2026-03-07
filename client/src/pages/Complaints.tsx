import { useState, useEffect } from 'react';
import api from '../api/client';
import Badge from '../components/Badge';
import Modal from '../components/Modal';
import { useToast } from '../components/Toast';

const CATEGORIES = ['electrical', 'plumbing', 'furniture', 'cleaning', 'internet', 'other'] as const;
const CATEGORY_ICONS: Record<string, string> = {
    electrical: 'bolt', plumbing: 'water_drop', furniture: 'chair', cleaning: 'cleaning_services', internet: 'wifi', other: 'settings',
};

export default function Complaints() {
    const [complaints, setComplaints] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewModal, setShowNewModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
    const [submitting, setSubmitting] = useState(false);
    const { showToast } = useToast();

    const [form, setForm] = useState({
        category: 'electrical' as string,
        title: '',
        description: '',
        priority: 'medium' as string,
    });

    const fetchComplaints = async () => {
        try {
            const { data } = await api.get('/complaints');
            setComplaints(data.data?.complaints || []);
        } catch (err) {
            console.error('Failed to fetch complaints', err);
            setComplaints([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchComplaints(); }, []);

    const handleNewComplaint = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await api.post('/complaints', form);
            showToast('Complaint filed successfully!', 'success');
            setShowNewModal(false);
            setForm({ category: 'electrical', title: '', description: '', priority: 'medium' });
            fetchComplaints();
        } catch (err: any) {
            showToast(err.response?.data?.message || 'Failed to file complaint', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleViewDetails = (comp: any) => {
        setSelectedComplaint(comp);
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
                    <h1 className="text-2xl font-bold text-gray-900 mb-1">Maintenance Complaints</h1>
                    <p className="text-sm text-gray-500 font-medium">Report and track maintenance issues.</p>
                </div>
                <button onClick={() => setShowNewModal(true)} className="btn btn-primary shadow-md shadow-brand-primary/20 flex gap-2">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    File Complaint
                </button>
            </div>

            <div className="card animate-fade-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider font-bold">
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Title</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {complaints.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500 text-sm font-medium">
                                        <span className="material-symbols-outlined text-[40px] text-gray-300 block mb-2">check_circle</span>
                                        No complaints filed yet. Click "File Complaint" to report an issue.
                                    </td>
                                </tr>
                            ) : (
                                complaints.map((comp: any) => (
                                    <tr key={comp._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{new Date(comp.createdAt).toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold capitalize">
                                                <span className="material-symbols-outlined text-[14px]">{CATEGORY_ICONS[comp.category] || 'settings'}</span>
                                                {comp.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium max-w-[250px] truncate" title={comp.title}>{comp.title}</td>
                                        <td className="px-6 py-4">
                                            <Badge status={comp.status} />
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleViewDetails(comp)} className="text-brand-primary hover:text-[#7a0e12] font-semibold text-sm transition-colors py-1 px-3 rounded-md hover:bg-red-50">
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

            {/* New Complaint Modal */}
            <Modal open={showNewModal} onClose={() => setShowNewModal(false)} title="File a Complaint">
                <form onSubmit={handleNewComplaint} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                        <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} className="input-field">
                            {CATEGORIES.map(cat => (
                                <option key={cat} value={cat} className="capitalize">{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Title</label>
                        <input type="text" required placeholder="Brief title of the issue" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="input-field" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                        <textarea required placeholder="Describe the issue in detail..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field min-h-[100px] resize-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Priority</label>
                        <div className="flex gap-3">
                            {['low', 'medium', 'high'].map(p => (
                                <button
                                    key={p}
                                    type="button"
                                    onClick={() => setForm({ ...form, priority: p })}
                                    className={`flex-1 py-2 rounded-lg text-sm font-semibold capitalize transition-all border ${form.priority === p
                                        ? p === 'high' ? 'bg-red-50 border-red-300 text-red-700' : p === 'medium' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-green-50 border-green-300 text-green-700'
                                        : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
                                        }`}
                                >
                                    {p}
                                </button>
                            ))}
                        </div>
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
            <Modal open={showDetailModal} onClose={() => setShowDetailModal(false)} title="Complaint Details">
                {selectedComplaint && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Date Filed</div>
                                <div className="text-sm font-semibold text-gray-900">{new Date(selectedComplaint.createdAt).toLocaleDateString()}</div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Category</div>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-gray-100 text-gray-700 text-xs font-semibold capitalize">
                                    <span className="material-symbols-outlined text-[14px]">{CATEGORY_ICONS[selectedComplaint.category] || 'settings'}</span>
                                    {selectedComplaint.category}
                                </span>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Priority</div>
                                <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-bold uppercase ${selectedComplaint.priority === 'high' ? 'bg-red-100 text-red-800' : selectedComplaint.priority === 'medium' ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                                    }`}>{selectedComplaint.priority}</span>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Status</div>
                                <Badge status={selectedComplaint.status} />
                            </div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</div>
                            <div className="text-sm font-semibold text-gray-900">{selectedComplaint.title}</div>
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</div>
                            <div className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedComplaint.description}</div>
                        </div>
                        {selectedComplaint.assignedTo && (
                            <div>
                                <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Assigned To</div>
                                <div className="text-sm font-semibold text-gray-900">{selectedComplaint.assignedTo}</div>
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
