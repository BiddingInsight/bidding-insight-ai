
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../services/database';
import { Tender, User, ProcurementPlan, Company, TenderStatus, SignUpDetails } from '../types';
import { Spinner } from '../components/Spinner';
import { Button } from '../components/Button';
import { REGIONS, INDUSTRIES } from '../constants';
import { 
    PencilSquareIcon, TrashIcon, UserPlusIcon, NoSymbolIcon, CheckCircleIcon, ArrowPathIcon, CloseIcon
} from '../components/IconComponents';

type AdminTab = 'tenders' | 'users' | 'plans';
type ModalType = 'tender' | 'user' | 'plan' | 'confirmation' | null;

export const AdminPage: React.FC = () => {
    const [currentTab, setCurrentTab] = useState<AdminTab>('tenders');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [tenders, setTenders] = useState<Tender[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [plans, setPlans] = useState<ProcurementPlan[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);

    const [modal, setModal] = useState<{ type: ModalType; data: any }>({ type: null, data: null });

    const loadData = useCallback(async (showLoading = true) => {
        if (showLoading) setIsLoading(true);
        try {
            const [tendersData, usersData, plansData, companiesData] = await Promise.all([
                db.getTenders(),
                db.getUsers(),
                db.getProcurementPlans(),
                db.getCompanies(),
            ]);
            setTenders(tendersData);
            setUsers(usersData);
            setPlans(plansData);
            setCompanies(companiesData);
        } catch (error) {
            console.error("Failed to load admin data", error);
            alert("Could not load data. Please try again.");
        } finally {
            if (showLoading) setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadData();
    }, [loadData]);

    const closeModal = () => setModal({ type: null, data: null });

    // Action handlers
    const handleAdd = (type: 'tender' | 'user' | 'plan') => {
        setModal({ type, data: null });
    };

    const handleEdit = (type: 'tender' | 'user', item: any) => {
        setModal({ type, data: item });
    };
    
    const handleDelete = (item: any, deleteFn: () => Promise<void>, name: string) => {
        setModal({
            type: 'confirmation',
            data: {
                title: `Delete ${name}`,
                message: `Are you sure you want to delete "${item.title || `${item.name} ${item.surname}` || item.entity}"? This action cannot be undone.`,
                onConfirm: async () => {
                    await deleteFn();
                    await loadData(false);
                    closeModal();
                }
            }
        });
    };

    const handleUserStatusChange = (user: User) => {
        setModal({
             type: 'confirmation',
             data: {
                title: `${user.status === 'active' ? 'Suspend' : 'Activate'} User`,
                message: `Are you sure you want to ${user.status === 'active' ? 'suspend' : 'activate'} the user "${user.name} ${user.surname}"?`,
                onConfirm: async () => {
                    await db.updateUser(user.id, { status: user.status === 'active' ? 'suspended' : 'active' });
                    await loadData(false);
                    closeModal();
                }
             }
        });
    };

    const handleTenderStatusChange = (tender: Tender, status: TenderStatus) => {
        setModal({
             type: 'confirmation',
             data: {
                title: `Cancel Tender`,
                message: `Are you sure you want to change the status of "${tender.title}" to "Cancelled"?`,
                onConfirm: async () => {
                    await db.updateTender(tender.id, { status });
                    await loadData(false);
                    closeModal();
                }
             }
        });
    };

    const handleFormSubmit = async (formData: any, type: 'tender' | 'user' | 'plan') => {
        setIsSubmitting(true);
        try {
            switch(type) {
                case 'tender':
                    if (formData.id) {
                        await db.updateTender(formData.id, formData);
                    } else {
                        await db.addTender(formData);
                    }
                    break;
                case 'user':
                     // Note: We don't support editing users, only adding and changing status
                    await db.addUser(formData, true);
                    break;
                case 'plan':
                    await db.addProcurementPlan(formData);
                    break;
            }
            await loadData(false);
            closeModal();
        } catch (error) {
            console.error(`Failed to save ${type}`, error);
            alert(`Error: ${error instanceof Error ? error.message : 'An unknown error occurred'}`);
        } finally {
            setIsSubmitting(false);
        }
    }

    const TabButton: React.FC<{ tabId: AdminTab; title: string }> = ({ tabId, title }) => (
        <button
          onClick={() => setCurrentTab(tabId)}
          className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
            currentTab === tabId
              ? 'bg-brand-blue text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {title}
        </button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-brand-blue-dark">Admin Dashboard</h1>
                <Button variant="ghost" onClick={() => loadData()} disabled={isLoading}>
                    <ArrowPathIcon className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Refresh Data
                </Button>
            </div>
            
            <div className="flex border-b border-gray-300">
                <TabButton tabId="tenders" title="Manage Tenders" />
                <TabButton tabId="users" title="Manage Users" />
                <TabButton tabId="plans" title="Manage Procurement Plans" />
            </div>

            <div className="bg-white p-6 rounded-b-lg shadow-md">
                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <Spinner size="lg" />
                    </div>
                ) : (
                    <>
                        {currentTab === 'tenders' && <ManageTenders tenders={tenders} onEdit={(t) => handleEdit('tender', t)} onCancel={(t) => handleTenderStatusChange(t, TenderStatus.Cancelled)} onDelete={(t) => handleDelete(t, () => db.deleteTender(t.id), 'Tender')} onAdd={() => handleAdd('tender')} />}
                        {currentTab === 'users' && <ManageUsers users={users} onStatusChange={handleUserStatusChange} onDelete={(u) => handleDelete(u, () => db.deleteUser(u.id), 'User')} onAdd={() => handleAdd('user')} />}
                        {currentTab === 'plans' && <ManagePlans plans={plans} onDelete={(p) => handleDelete(p, () => db.deleteProcurementPlan(p.id), 'Plan')} onAdd={() => handleAdd('plan')} />}
                    </>
                )}
            </div>

            {modal.type === 'tender' && <TenderFormModal companies={companies} tender={modal.data} onClose={closeModal} onSubmit={(data) => handleFormSubmit(data, 'tender')} isSubmitting={isSubmitting} />}
            {modal.type === 'user' && <UserFormModal companies={companies} onClose={closeModal} onSubmit={(data) => handleFormSubmit(data, 'user')} isSubmitting={isSubmitting} />}
            {modal.type === 'plan' && <PlanFormModal onClose={closeModal} onSubmit={(data) => handleFormSubmit(data, 'plan')} isSubmitting={isSubmitting} />}
            {modal.type === 'confirmation' && <ConfirmationModal {...modal.data} onClose={closeModal} />}
        </div>
    );
};


// --- Sub-components for Admin Page ---

const ManageTenders: React.FC<{tenders: Tender[], onEdit: (t: Tender) => void, onCancel: (t: Tender) => void, onDelete: (t: Tender) => void, onAdd: () => void}> = ({ tenders, onEdit, onCancel, onDelete, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Tenders ({tenders.length})</h2>
            <Button onClick={onAdd}>Add Tender</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Ref #</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Entity</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Closing Date</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tenders.map(t => (
                        <tr key={t.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{t.referenceNumber}</td>
                            <td className="p-2">{t.title}</td>
                            <td className="p-2">{t.entity}</td>
                            <td className="p-2">{t.status}</td>
                            <td className="p-2">{new Date(t.closingDate).toLocaleDateString()}</td>
                            <td className="p-2 flex gap-2">
                                <Button variant="ghost" onClick={() => onEdit(t)} className="!p-2"><PencilSquareIcon className="w-5 h-5" /></Button>
                                {t.status === 'Open' && <Button variant="ghost" onClick={() => onCancel(t)} className="!p-2"><NoSymbolIcon className="w-5 h-5 text-yellow-600" /></Button>}
                                <Button variant="ghost" onClick={() => onDelete(t)} className="!p-2"><TrashIcon className="w-5 h-5 text-red-600" /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ManageUsers: React.FC<{users: User[], onStatusChange: (u: User) => void, onDelete: (u: User) => void, onAdd: () => void}> = ({ users, onStatusChange, onDelete, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Users ({users.length})</h2>
            <Button onClick={onAdd}><UserPlusIcon className="w-5 h-5 mr-2"/> Add User</Button>
        </div>
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Email</th>
                        <th className="p-2">Role</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(u => (
                        <tr key={u.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{u.name} {u.surname}</td>
                            <td className="p-2">{u.email}</td>
                            <td className="p-2">{u.isAdmin ? 'Admin' : 'User'}</td>
                            <td className="p-2"><span className={`px-2 py-1 text-xs rounded-full ${u.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.status}</span></td>
                            <td className="p-2 flex gap-2">
                                {!u.isAdmin && (
                                    <>
                                        <Button variant="ghost" onClick={() => onStatusChange(u)} className="!p-2" title={u.status === 'active' ? 'Suspend' : 'Activate'}>
                                            {u.status === 'active' ? <NoSymbolIcon className="w-5 h-5 text-yellow-600"/> : <CheckCircleIcon className="w-5 h-5 text-green-600"/>}
                                        </Button>
                                        <Button variant="ghost" onClick={() => onDelete(u)} className="!p-2"><TrashIcon className="w-5 h-5 text-red-600" /></Button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ManagePlans: React.FC<{plans: ProcurementPlan[], onDelete: (p: ProcurementPlan) => void, onAdd: () => void}> = ({ plans, onDelete, onAdd }) => (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Procurement Plans ({plans.length})</h2>
            <Button onClick={onAdd}>Add Plan</Button>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2">Entity</th>
                        <th className="p-2">Title</th>
                        <th className="p-2">Period</th>
                        <th className="p-2">Link</th>
                        <th className="p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {plans.map(p => (
                        <tr key={p.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">{p.entity}</td>
                            <td className="p-2">{p.title}</td>
                            <td className="p-2">{p.period}</td>
                            <td className="p-2"><a href={p.link} target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">View</a></td>
                            <td className="p-2 flex gap-2">
                                <Button variant="ghost" onClick={() => onDelete(p)} className="!p-2"><TrashIcon className="w-5 h-5 text-red-600" /></Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

// --- Modal Components ---

const Modal:React.FC<{children: React.ReactNode, title: string, onClose: () => void}> = ({children, title, onClose}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-start pt-16">
        <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative animate-scale-in">
             <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                <CloseIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">{title}</h3>
            {children}
        </div>
        <style>{`
        @keyframes scale-in {
          from { transform: scale(0.95) translateY(-20px); opacity: 0; }
          to { transform: scale(1) translateY(0); opacity: 1; }
        }
        .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
      `}</style>
    </div>
);

const ConfirmationModal: React.FC<{ title: string, message: string, onConfirm: () => void, onClose: () => void }> = ({ title, message, onConfirm, onClose }) => (
    <Modal title={title} onClose={onClose}>
        <p className="mb-6">{message}</p>
        <div className="flex justify-end gap-4">
            <Button variant="plain" onClick={onClose}>Cancel</Button>
            <Button variant="danger" onClick={onConfirm}>Confirm</Button>
        </div>
    </Modal>
);

const TenderFormModal: React.FC<{companies: Company[], tender: Tender | null, onClose: () => void, onSubmit: (data: any) => void, isSubmitting: boolean}> = ({ companies, tender, onClose, onSubmit, isSubmitting }) => {
    const [form, setForm] = useState({
        id: tender?.id || '',
        title: tender?.title || '',
        referenceNumber: tender?.referenceNumber || '',
        description: tender?.description || '',
        entity: tender?.entity || '',
        entityId: tender?.entityId || '',
        status: tender?.status || TenderStatus.Open,
        closingDate: tender?.closingDate ? new Date(tender.closingDate).toISOString().substring(0, 10) : '',
        region: tender?.region || REGIONS[0],
        industry: tender?.industry || INDUSTRIES[0],
        imageUrl: tender?.imageUrl || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'entity') {
            const selectedCompany = companies.find(c => c.name === value);
            setForm(prev => ({...prev, entity: value, entityId: selectedCompany?.id || '' }));
        } else {
             setForm(prev => ({ ...prev, [name]: value }));
        }
    };
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submissionData = { ...form, closingDate: new Date(form.closingDate).toISOString() };
        onSubmit(submissionData);
    };

    return (
        <Modal title={tender ? "Edit Tender" : "Add Tender"} onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="referenceNumber" placeholder="Reference Number" value={form.referenceNumber} onChange={handleChange} required className="w-full p-2 border rounded" />
                <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} required className="w-full p-2 border rounded" rows={4}></textarea>
                <input type="url" name="imageUrl" placeholder="Image URL (optional)" value={form.imageUrl} onChange={handleChange} className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-4">
                     <select name="entity" value={form.entity} onChange={handleChange} required className="w-full p-2 border rounded bg-white">
                        <option value="">Select Entity</option>
                        {companies.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                     </select>
                     <select name="status" value={form.status} onChange={handleChange} required className="w-full p-2 border rounded bg-white">
                        {Object.values(TenderStatus).map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                </div>
                 <div className="grid grid-cols-2 gap-4">
                     <select name="region" value={form.region} onChange={handleChange} required className="w-full p-2 border rounded bg-white">
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                     </select>
                     <select name="industry" value={form.industry} onChange={handleChange} required className="w-full p-2 border rounded bg-white">
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                     </select>
                </div>
                <div>
                    <label className="text-sm">Closing Date</label>
                    <input type="date" name="closingDate" value={form.closingDate} onChange={handleChange} required className="w-full p-2 border rounded" />
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="plain" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size="sm" /> : (tender ? 'Save Changes' : 'Add Tender')}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const UserFormModal: React.FC<{companies: Company[], onClose: () => void, onSubmit: (data: SignUpDetails) => void, isSubmitting: boolean}> = ({ companies, onClose, onSubmit, isSubmitting }) => {
    const [form, setForm] = useState<SignUpDetails>({
        companyRepresentativeName: '', email: '', companyName: '', industry: INDUSTRIES[0], region: REGIONS[0], password: '', interestedEntityIds: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };
    
    const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
        setForm(prev => ({ ...prev, interestedEntityIds: selectedIds }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (form.password.length < 6) {
            alert("Password must be at least 6 characters long.");
            return;
        }
        onSubmit(form);
    };

    return (
        <Modal title="Add New User" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                <input type="text" name="companyRepresentativeName" placeholder="Representative Full Name" value={form.companyRepresentativeName} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="password" name="password" placeholder="Initial Password (min. 6 characters)" value={form.password} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="companyName" placeholder="Company Name" value={form.companyName} onChange={handleChange} required className="w-full p-2 border rounded" />
                <div className="grid grid-cols-2 gap-4">
                     <select name="region" value={form.region} onChange={handleChange} required className="w-full p-2 border rounded bg-white">
                        {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                     </select>
                     <select name="industry" value={form.industry} onChange={handleChange} required className="w-full p-2 border rounded bg-white">
                        {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
                     </select>
                </div>
                 <div>
                  <label htmlFor="interestedEntityIds" className="block text-sm font-medium text-gray-700 mb-1">Entity Interests</label>
                  <select
                    id="interestedEntityIds"
                    multiple
                    name="interestedEntityIds"
                    value={form.interestedEntityIds}
                    onChange={handleMultiSelectChange}
                    className="w-full p-2 border rounded bg-white h-40"
                  >
                    {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="plain" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size="sm" /> : 'Add User'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

const PlanFormModal: React.FC<{onClose: () => void, onSubmit: (data: Omit<ProcurementPlan, 'id'>) => void, isSubmitting: boolean}> = ({ onClose, onSubmit, isSubmitting }) => {
    const [form, setForm] = useState({ entity: '', title: '', period: '', link: '' });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm(prev => ({...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(form);
    }

     return (
        <Modal title="Add Procurement Plan" onClose={onClose}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="entity" placeholder="Entity Name" value={form.entity} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="title" placeholder="Title" value={form.title} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="text" name="period" placeholder="Period (e.g., 2024-04-01 to 2025-03-31)" value={form.period} onChange={handleChange} required className="w-full p-2 border rounded" />
                <input type="url" name="link" placeholder="Link to Plan (URL)" value={form.link} onChange={handleChange} required className="w-full p-2 border rounded" />
                 <div className="flex justify-end gap-4 pt-4">
                    <Button type="button" variant="plain" onClick={onClose} disabled={isSubmitting}>Cancel</Button>
                    <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? <Spinner size="sm" /> : 'Add Plan'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};