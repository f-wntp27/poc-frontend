import { defineComponent } from 'vue';
import 'primevue/resources/themes/md-light-indigo/theme.css'; //theme
import 'primevue/resources/primevue.min.css'; //core css
import 'primeicons/primeicons.css'; //icons
import 'primeflex/primeflex.css';

import Config from 'primevue/config';

// import as component
import Badge from 'primevue/badge';

// import as directive
import BadgeDirective from 'primevue/badgedirective';

// Data
import TreeTable from 'primevue/treetable';
import DataTable from 'primevue/datatable';
import Row from 'primevue/row';
import Column from 'primevue/column';
import ColumnGroup from 'primevue/columngroup';
import Paginator from 'primevue/paginator';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import SplitButton from 'primevue/splitbutton';

// Panel
import Fieldset from 'primevue/fieldset';
import TabView from 'primevue/tabview';
import TabPanel from 'primevue/tabpanel';
import Card from 'primevue/card';
import Divider from 'primevue/divider';
import Toolbar from 'primevue/toolbar';
import Timeline from 'primevue/timeline';

// Overlay
import ProgressSpinner from 'primevue/progressspinner';
import ProgressBar from 'primevue/progressbar';
import BlockUI from 'primevue/blockui';
import Sidebar from 'primevue/sidebar';
import ConfirmationService from 'primevue/confirmationservice';
import ConfirmDialog from 'primevue/confirmdialog';
import Dialog from 'primevue/dialog';

// Menu
import PanelMenu from 'primevue/panelmenu';
import Breadcrumb from 'primevue/breadcrumb';

import Menu from 'primevue/menu';

// Media
import Image from 'primevue/image';
import FileUpload from 'primevue/fileupload';

// Form
import Calendar from 'primevue/calendar';
import Checkbox from 'primevue/checkbox';
import Dropdown from 'primevue/dropdown';
import InputMask from 'primevue/inputmask';
import InputNumber from 'primevue/inputnumber';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import RadioButton from 'primevue/radiobutton';
import AutoComplete from 'primevue/autocomplete';
import Textarea from 'primevue/textarea';
import Editor from 'primevue/editor';

// Message
import Toast from 'primevue/toast';
import ToastService from 'primevue/toastservice';
import TabMenu from 'primevue/tabmenu';

import Rating from 'primevue/rating';
import SpeedDial from 'primevue/speeddial';
import Chart from 'primevue/chart';
import Steps from 'primevue/steps';

import Galleria from 'primevue/galleria';
import Tag from 'primevue/tag';
import ConfirmPopup from 'primevue/confirmpopup';

const Components = defineComponent({
  DataTable,
  Row,
  Column,
  ColumnGroup,
  Paginator,
  Button,
  SplitButton,
  Fieldset,
  TabView,
  TabPanel,
  Card,
  Divider,
  Toolbar,
  ProgressSpinner,
  ProgressBar,
  BlockUI,
  Sidebar,
  ConfirmDialog,
  Dialog,
  PanelMenu,
  Breadcrumb,
  Image,
  FileUpload,
  Calendar,
  Checkbox,
  Dropdown,
  InputMask,
  InputNumber,
  InputSwitch,
  InputText,
  Password,
  RadioButton,
  Toast,
  AutoComplete,
  Textarea,
  Editor,
  Avatar,
  TabMenu,
  Menu,
  Rating,
  TreeTable,
  SpeedDial,
  Chart,
  Steps,
  Badge,
  BadgeDirective,
  Galleria,
  Tag,
  ConfirmPopup,
  Timeline,
});

export default { Components, Config, ToastService, ConfirmationService };
