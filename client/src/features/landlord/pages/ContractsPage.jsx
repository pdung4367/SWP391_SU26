import React, { useState } from 'react';
import {
  Plus,
  Search,
  ChevronDown,
  Eye,
  Edit,
  Trash2,
  X,
  Calendar,
  FileText,
  AlertCircle,
  Download,
} from 'lucide-react';
import { useContracts } from '../hooks/useContracts';
import Button from '../../../components/common/Button';
import Loading from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import Badge from '../../../components/ui/Badge';
import './ContractsPage.css';

const ContractsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [selectedContract, setSelectedContract] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [showTerminateModal, setShowTerminateModal] = useState(false);
  const [renewData, setRenewData] = useState({ duration: 12 });
  const [terminateReason, setTerminateReason] = useState('');

  const { contracts, loading, error, renewContract, terminateContract } = useContracts();

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch =
      contract.tenantName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.roomTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contract.contractNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || contract.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'EXPIRED':
        return 'danger';
      case 'TERMINATED':
        return 'info';
      default:
        return 'default';
    }
  };

  const handleRenew = async () => {
    if (!renewData.duration || renewData.duration <= 0) {
      alert('Please enter a valid duration');
      return;
    }

    try {
      await renewContract(selectedContract.id, renewData);
      setShowRenewModal(false);
      setShowDetailModal(false);
      setSelectedContract(null);
      setRenewData({ duration: 12 });
    } catch (err) {
      alert(err.message || 'Failed to renew contract');
    }
  };

  const handleTerminate = async () => {
    if (!terminateReason.trim()) {
      alert('Please provide a reason for termination');
      return;
    }

    try {
      await terminateContract(selectedContract.id, terminateReason);
      setShowTerminateModal(false);
      setShowDetailModal(false);
      setSelectedContract(null);
      setTerminateReason('');
    } catch (err) {
      alert(err.message || 'Failed to terminate contract');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="contracts">
      {/* Header */}
      <div className="contracts__header">
        <div>
          <h1 className="contracts__title">Contracts</h1>
          <p className="contracts__subtitle">Manage rental contracts and agreements</p>
        </div>
        <Button variant="primary">
          <Plus size={18} />
          New Contract
        </Button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="alert alert--error">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="contracts__filter-bar">
        <div className="filter-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search by tenant, room, or contract number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-dropdown-container">
          <button
            className="filter-dropdown-btn"
            onClick={() => setShowStatusDropdown(!showStatusDropdown)}
          >
            <span>{statusFilter}</span>
            <ChevronDown size={16} />
          </button>
          {showStatusDropdown && (
            <div className="filter-dropdown-menu">
              {['All', 'ACTIVE', 'PENDING', 'EXPIRED', 'TERMINATED'].map(status => (
                <button
                  key={status}
                  className={`filter-dropdown-item ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => {
                    setStatusFilter(status);
                    setShowStatusDropdown(false);
                  }}
                >
                  {status}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Contracts Grid */}
      {filteredContracts.length > 0 ? (
        <div className="contracts__grid">
          {filteredContracts.map(contract => (
            <div className="contract-card" key={contract.id}>
              <div className="contract-card__header">
                <div>
                  <h3 className="contract-card__title">{contract.contractNumber}</h3>
                  <p className="contract-card__subtitle">{contract.roomTitle}</p>
                </div>
                <Badge variant={getStatusColor(contract.status)}>
                  {contract.status}
                </Badge>
              </div>

              <div className="contract-card__content">
                <div className="contract-info-row">
                  <span className="label">Tenant</span>
                  <span className="value">{contract.tenantName}</span>
                </div>
                <div className="contract-info-row">
                  <span className="label">Monthly Rent</span>
                  <span className="value">${contract.monthlyRent?.toLocaleString()}</span>
                </div>
                <div className="contract-info-row">
                  <span className="label">Start Date</span>
                  <span className="value">
                    <Calendar size={14} />
                    {new Date(contract.startDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="contract-info-row">
                  <span className="label">End Date</span>
                  <span className="value">
                    <Calendar size={14} />
                    {new Date(contract.endDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="contract-card__actions">
                <button
                  className="action-btn action-btn--view"
                  onClick={() => {
                    setSelectedContract(contract);
                    setShowDetailModal(true);
                  }}
                >
                  <Eye size={16} />
                  View
                </button>
                <button className="action-btn action-btn--download">
                  <Download size={16} />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          icon="📄"
          title="No contracts found"
          description="Create your first contract to get started"
        />
      )}

      {/* Detail Modal */}
      {showDetailModal && selectedContract && (
        <div className="modal-backdrop" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content modal-content--large" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Contract Details</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowDetailModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              {/* Contract Header */}
              <div className="detail-section">
                <div className="contract-header-display">
                  <div>
                    <h4>{selectedContract.contractNumber}</h4>
                    <p>{selectedContract.roomTitle}</p>
                  </div>
                  <Badge variant={getStatusColor(selectedContract.status)}>
                    {selectedContract.status}
                  </Badge>
                </div>
              </div>

              {/* Tenant Info */}
              <div className="detail-section">
                <h4 className="section-title">Tenant Information</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Name</label>
                    <div className="detail-value">{selectedContract.tenantName}</div>
                  </div>
                  <div className="detail-item">
                    <label>Email</label>
                    <div className="detail-value">{selectedContract.tenantEmail}</div>
                  </div>
                  <div className="detail-item">
                    <label>Phone</label>
                    <div className="detail-value">{selectedContract.tenantPhone}</div>
                  </div>
                </div>
              </div>

              {/* Contract Terms */}
              <div className="detail-section">
                <h4 className="section-title">Contract Terms</h4>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Start Date</label>
                    <div className="detail-value">
                      <Calendar size={14} />
                      {new Date(selectedContract.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>End Date</label>
                    <div className="detail-value">
                      <Calendar size={14} />
                      {new Date(selectedContract.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="detail-item">
                    <label>Duration</label>
                    <div className="detail-value">{selectedContract.duration} months</div>
                  </div>
                  <div className="detail-item">
                    <label>Monthly Rent</label>
                    <div className="detail-value">${selectedContract.monthlyRent?.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Additional Terms */}
              {selectedContract.terms && (
                <div className="detail-section">
                  <h4 className="section-title">Additional Terms</h4>
                  <div className="terms-box">{selectedContract.terms}</div>
                </div>
              )}
            </div>

            {/* Modal Footer with Actions */}
            {selectedContract.status === 'ACTIVE' && (
              <div className="modal-footer">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowTerminateModal(true);
                  }}
                >
                  <X size={16} />
                  Terminate
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowRenewModal(true);
                  }}
                >
                  <FileText size={16} />
                  Renew Contract
                </Button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Renew Modal */}
      {showRenewModal && selectedContract && (
        <div className="modal-backdrop" onClick={() => setShowRenewModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Renew Contract</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowRenewModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="renew-info">
                Renew the contract for {selectedContract.tenantName} in {selectedContract.roomTitle}
              </p>
              <div className="form-group">
                <label>Renewal Duration (months)</label>
                <input
                  type="number"
                  min="1"
                  value={renewData.duration}
                  onChange={(e) => setRenewData({ duration: parseInt(e.target.value) })}
                />
              </div>
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setShowRenewModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRenew}
              >
                Renew Contract
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Terminate Modal */}
      {showTerminateModal && selectedContract && (
        <div className="modal-backdrop" onClick={() => setShowTerminateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Terminate Contract</h3>
              <button
                className="modal-close-btn"
                onClick={() => setShowTerminateModal(false)}
              >
                <X size={18} />
              </button>
            </div>

            <div className="modal-body">
              <p className="terminate-info">
                Please provide a reason for terminating this contract.
              </p>
              <textarea
                className="terminate-textarea"
                placeholder="Enter termination reason..."
                value={terminateReason}
                onChange={(e) => setTerminateReason(e.target.value)}
                rows="5"
              />
            </div>

            <div className="modal-footer">
              <Button
                variant="secondary"
                onClick={() => setShowTerminateModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleTerminate}
              >
                Terminate Contract
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractsPage;
