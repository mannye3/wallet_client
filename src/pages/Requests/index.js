import React, { useEffect, useState } from 'react';
import { message, Tabs, Table, Spin } from "antd";
import moment from "moment";
import { useSelector } from 'react-redux';
import NewRequestModal from "./NewRequestModal";
import PageTitle from '../../componets/PageTitle';
import { GetAllRequestsByUser, UpdateRequestStatus } from '../../apicalls/request';

const { TabPane } = Tabs;

function Requests() {
  const [data, setData] = useState({ sent: [], received: [] });
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [loading, setLoading] = useState(false); // General loading for fetching data
  const [actionLoading, setActionLoading] = useState({}); // Loader state for each action by ID
  const { user } = useSelector((state) => state.users);

  // Fetch data
  const getData = async () => {
    try {
      setLoading(true); // Start loader
      const response = await GetAllRequestsByUser();
      if (response.success) {
        const sentData = response.data.filter(item => item.sender._id === user._id);
        const receivedData = response.data.filter(item => item.receiver._id === user._id);
        setData({ sent: sentData, received: receivedData });
      }
      setLoading(false); // Stop loader after fetching
    } catch (error) {
      setLoading(false);
      message.error(error.message);
    }
  };

  // Update request status with loading for each action
  const updateStatus = async (record, status) => {
    if (status === "accepted" && record.amount > user.balance) {
      message.error("Insufficient funds");
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [record._id]: true })); // Set specific loading for action
      const response = await UpdateRequestStatus({
        ...record,
        status,
      });

      if (response.success) {
        message.success(response.message);
        getData(); // Reload data after status update
      } else {
        message.error(response.message);
      }
    } catch (error) {
      message.error(error.message);
    } finally {
      setActionLoading((prev) => ({ ...prev, [record._id]: false })); // Clear specific action loading
    }
  };

  // Table columns configuration
  const columns = [
    {
      title: "Request ID",
      dataIndex: "_id",
    },
    {
      title: "User",
      dataIndex: "user",
      render: (text, record) => {
        const referenceUser = record.sender._id === user._id ? record.receiver : record.sender;
        return `${referenceUser.firstname} ${referenceUser.lastname}`;
      },
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text, record) => record.sender._id === user._id ? "Sender" : "Receiver",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (text) => `$${text}`,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (text) => moment(text).format("DD-MM-YYYY hh:mm:ss A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => <span className={`tag ${text}`}>{text}</span>,
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (text, record) => {
        if (record.status === "pending" && record.receiver._id === user._id) {
          return (
            <div className="flex gap-1">
              <Spin spinning={!!actionLoading[record._id]} tip="Processing...">
                <h1
                  className="text-sm underline cursor-pointer"
                  onClick={() => updateStatus(record, "rejected")}
                >
                  {actionLoading[record._id] ? "Rejecting..." : "Reject"}
                </h1>
                <h1
                  className="text-sm underline cursor-pointer"
                  onClick={() => updateStatus(record, "accepted")}
                >
                  {actionLoading[record._id] ? "Accepting..." : "Accept"}
                </h1>
              </Spin>
            </div>
          );
        } else {
          return <span>No actions available</span>;
        }
      },
    },
  ];

  useEffect(() => {
    getData();
  }, []);

  return (
    <div>
      <div className="flex justify-between">
        <h1 className="text-md">$ {user.balance || 0}</h1>
        <PageTitle title="Requests" />
        <button
          className="primary-outlined-btn"
          onClick={() => setShowNewRequestModal(true)}
        >
          Request Funds
        </button>
      </div>

      <Tabs defaultActiveKey="1">
        <TabPane tab="Sent" key="1">
          <Table columns={columns} dataSource={data.sent} loading={loading} />
        </TabPane>
        <TabPane tab="Received" key="2">
          <Table columns={columns} dataSource={data.received} loading={loading} />
        </TabPane>
      </Tabs>

      {showNewRequestModal && (
        <NewRequestModal
          showNewRequestModal={showNewRequestModal}
          setShowNewRequestModal={setShowNewRequestModal}
          reloadData={getData}
        />
      )}
    </div>
  );
}

export default Requests;
