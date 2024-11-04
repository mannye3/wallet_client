import { Form, Modal, message, Input, InputNumber, Spin } from 'antd';
import React, { useState } from 'react';
import { TransferFund, VerifyAccount } from './../../apicalls/transactions';
import { useSelector } from 'react-redux';
import { SendRequest } from '../../apicalls/request';

function NewRequestModal({ showNewRequestModal, setShowNewRequestModal }) {
  const { user } = useSelector((state) => state.users);
  const [isVerify, setIsVerify] = useState('');
  const [receiverDetails, setReceiverDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const verifyAccount = async (receiver) => {
    try {
      const response = await VerifyAccount({ receiver });
      if (response.success) {
        setIsVerify('true');
        setReceiverDetails(response.data);
        message.success('Account Verified Successfully');
      } else {
        setIsVerify('false');
        message.error('Invalid Account');
      }
    } catch (error) {
      console.error('Error verifying account:', error);
      setIsVerify('false');
      message.error('Error verifying account');
    }
  };

 const onFinish = async (values) => {
  setLoading(true);
  try {
    const payload = {
      ...values,
      userId: user._id, // Rename to match backend expectation
      status: 'success',
    };

    const response = await SendRequest(payload);

    if (response.success) {
      message.success('Transfer Successful');
      handleModalClose();
      window.location.reload(); // Reload the page after success
    } else {
      message.error(response.message);
    }
  } catch (error) {
    console.error('Error during transfer:', error);
    message.error(error.message || 'Transfer failed');
  } finally {
    setLoading(false);
  }
};


  const handleReceiverChange = (e) => {
    const receiver = e.target.value;
    form.setFieldsValue({ receiver });

    if (receiver) {
      if (receiver === user._id) {
        message.error('You cannot send money to yourself.');
        form.setFieldsValue({ receiver: '' });
        return;
      }
      verifyAccount(receiver);
    } else {
      setIsVerify('');
      setReceiverDetails(null);
    }
  };

  const handleModalClose = () => {
    form.resetFields();
    setIsVerify('');
    setReceiverDetails(null);
    setShowNewRequestModal(false);
  };

  const amount = Number(form.getFieldValue('amount')) || 0;

  return (
    <Modal
      title="Transfer Fund"
      open={showNewRequestModal}
      onCancel={handleModalClose}
      footer={null}
    >
      <Spin spinning={loading} tip="Processing Transfer...">
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item
            name="receiver"
            label="Account Number"
            rules={[
              { required: true, message: 'Please enter an account number' },
              { len: 24, message: 'Receiver account number must be 24 characters long.' },
            ]}
          >
            <Input
              type="text"
              placeholder="Enter account number"
              maxLength={24}
              onChange={handleReceiverChange}
            />
          </Form.Item>

          {isVerify === 'true' && receiverDetails && (
            <div className="success-bg">
              <h1 className="text-sm">
                Account Verified: {receiverDetails.firstname} {receiverDetails.lastname}
              </h1>
              <p>Email: {receiverDetails.email}</p>
            </div>
          )}

          {isVerify === 'false' && (
            <div className="error-bg">
              <h1 className="text-sm">Invalid Account</h1>
            </div>
          )}

          <Form.Item
            name="amount"
            label="Amount"
            rules={[
              { required: true, message: 'Please enter an amount' },
              // {
              //   validator: (_, value) => {
              //     if (value < 1) {
              //       return Promise.reject('Amount must be greater than zero.');
              //     }
              //     if (value > user?.balance) {
              //       return Promise.reject(`Insufficient Balance: $${user?.balance || 0}`);
              //     }
              //     return Promise.resolve();
              //   },
              // },
            ]}
          >
            <InputNumber min={1} placeholder="Enter amount" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Enter description" />
          </Form.Item>

          <div className="flex justify-end gap-1">
            { isVerify === 'true' && (
              <button className="primary-contained-btn" htmlType="submit">
                Request
              </button>
            )}
            <button className="primary-outlined-btn" onClick={handleModalClose}>
              Cancel
            </button>
          </div>
        </Form>
      </Spin>
    </Modal>
  );
}

export default NewRequestModal;























































// import React, { useEffect } from "react";
// import { Modal, Form, message } from "antd";
// import { useDispatch, useSelector } from "react-redux";
// import { TransferFunds, VerifyAccount } from "../../apicalls/transactions";
// // import { ShowLoading, HideLoading } from "../../redux/loadersSlice";
// import { SendRequest } from "../../apicalls/requests";

// function NewRequestModal({
//   showNewRequestModal,
//   setShowNewRequestModal,
//   reloadData,
// }) {
//   const { user } = useSelector((state) => state.users);

//   const [isVerified, setIsVerified] = React.useState("");
//   const [form] = Form.useForm();
//   const dispatch = useDispatch();
//   const verifyAccount = async () => { 
//     try {
//       // dispatch(ShowLoading());
//       const response = await VerifyAccount({
//         receiver: form.getFieldValue("receiver"),
//       });
//       // dispatch(HideLoading());
//       if (response.success) {
//         setIsVerified("true");
//       } else {
//         setIsVerified("false");
//       }
//     } catch (error) {
//       // dispatch(HideLoading());
//       setIsVerified("false");
//     }
//   };

//   const onFinish = async (values) => {
//     try {

//       if(values.amount > user.balance){
//         message.error("Insufficient funds");
//         return;
//       }

//       // dispatch(ShowLoading());
//       const payload = {
//         ...values,
//         sender: user._id,
//         status: "success",
//         reference: values.reference || "no reference",
//       };
//       const response = await SendRequest(payload);
//       if (response.success) {
//         reloadData();
//         setShowNewRequestModal(false);
//         message.success(response.message);
//       } else {
//         message.error(response.message);
//       }
//       // dispatch(HideLoading());
//     } catch (error) {
//       message.error(error.message);
//       // dispatch(HideLoading());
//     }
//   };

//   return (
//     <div>
//       <Modal
//         title="Transfer Funds"
//         open={showNewRequestModal}
//         onCancel={() => setShowNewRequestModal(false)}
//         onClose={() => setShowNewRequestModal(false)}
//         footer={null}
//       >
//         <Form layout="vertical" form={form} onFinish={onFinish}>
//           <div className="flex gap-2 items-center">
//             <Form.Item label="Account Number" name="receiver" className="w-100">
//               <input type="text" />
//             </Form.Item>
//             <button
//               className="primary-contained-btn mt-1"
//               type="button"
//               onClick={verifyAccount}
//             >
//               VERIFY
//             </button>
//           </div>

//           {isVerified === "true" && (
//             <div className="success-bg">Account verified successfully</div>
//           )}

//           {isVerified === "false" && (
//             <div className="error-bg">Invalid Account</div>
//           )}

//           <Form.Item
//             label="Amount"
//             name="amount"
//             rules={[
//               {
//                 required: true,
//                 message: "Please input your amount!",
//               },
//               {
//                 max: user.balance,
//                 message: "Insufficient Balance",
//               },
//             ]}
//           >
//             <input type="number" max={user.balance} />
//           </Form.Item>

//           <Form.Item label="Description" name="description">
//             <textarea type="text" />
//           </Form.Item>

//           <div className="flex justify-end gap-1">
//             <button className="primary-outlined-btn">Cancel</button>
//             {isVerified === "true" && (
//               <button className="primary-contained-btn" type="submit">
//                 Request
//               </button>
//             )}
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// export default NewRequestModal;