# MERN Wallet Frontend

## Description

A React-based client application for wallet management, enabling users to request funds, accept or reject fund requests, and view transaction histories.

## Features

- **User Authentication**: Login/Signup interface.
- **Wallet Dashboard**: Overview of balance, transactions, and requests.
- **Transfer System**: Interface to send and deposit fun.
- **Request System**: Interface to send and accept/reject fund requests.
- **Stripe Payment Integration**: Integration of stripe payment.
- **Loader and Error Notifications**: User-friendly loaders and messages.

## Setup Instructions

### Prerequisites

- Node.js

### Environment Variables

- `REACT_APP_STRIPE_KEY`: Stripe key for payment integration.

### Installation

```bash
git clone <https://github.com/mannye3/wallet_client.git>
npm install
```

### Running the Application

```bash
npm start
```

## Component Structure

Outline of major components:

- **Dashboard**: Displays balance and transaction history.
- **Request Modal**: Allows users to send fund requests.
- **Deposit Modal**: Allows users to deposit fund via stripe.
- **Transfer Modal**: Allows users send funds to others.
- **Request List**: Shows received and sent requests, with action buttons.

## Technology Stack

- **React**: Frontend framework.
- **Redux**: State management.
- **Axios**: API calls.
- **Ant Design**: UI components.
- **Moment.js**: Date formatting.

## Contributing

Contributions are welcome! Please follow these steps to contribute to the project:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure all tests pass.
4. Submit a pull request explaining your changes.

## License

This project is licensed under the MIT License. Feel free to use, modify, and distribute the project as long as the license terms are met.

## Contact

For any questions or feedback, please feel free to reach out to:

**Emmanuel Aboajah**

- Email: [aboajahemmanuel@gmail.com](mailto:aboajahemmanuel@gmail.com)
- GitHub: [mannye3](https://github.com/mannye3)
