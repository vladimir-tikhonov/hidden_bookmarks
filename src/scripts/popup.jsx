import React from 'react';
import { render } from 'react-dom';

import 'styles/popup.scss';

const PopupPage = () => <h2>Popup page</h2>;

render(<PopupPage />, document.getElementById('app-container'));
