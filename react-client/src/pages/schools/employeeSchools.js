import React, {Component} from 'react';
import {connect} from "react-redux";
import {AddButton, Loader, PageTitle, SchoolsForm} from "../../components";
import {DetailsList, DetailsListLayoutMode,} from 'office-ui-fabric-react/lib/DetailsList';
import {deleteUserSchool, getUserSchools} from "../../actions/userSchools";
import {
  DefaultButton,
  Dialog,
  DialogFooter,
  DialogType,
  IconButton,
  Panel,
  PanelType,
  PrimaryButton,
  SelectionMode
} from "office-ui-fabric-react";
import {getSchools} from "../../actions/schools";
import {getEmployee} from "../../actions/user";

class SchoolsPage extends Component {

  editSchool(school) {
    this.setState({schoolToEdit: school, showPanel: true})
  }

  deleteSchool(schoolId) {
    const {employee, deleteSchool} = this.props;
    deleteSchool(employee.id, schoolId);
  }

  _openDeleteDialog(school) {
    this.setState({schoolToDelete: school, hideDialog: false})
  }

  _columns = [
    {
      key: 'schoolName',
      name: 'School Name',
      fieldName: 'school.name',
      minWidth: 210,
      maxWidth: 350,
      isRowHeader: true,
      isResizable: true,
      isPadded: true,
      onRender: ({school}) => {
        return <span>{school.name}</span>;
      },
    },
    {
      key: 'startDate',
      name: 'Start Date',
      fieldName: 'startDate',
      minWidth: 70,
      maxWidth: 100,
      isResizable: true,
      isPadded: true,
      onRender: ({startDate}) => {
        return <span>{new Date(startDate).toDateString()}</span>;
      },
    },
    {
      key: 'duration',
      name: 'Duration',
      fieldName: 'durationYears',
      minWidth: 30,
      maxWidth: 55,
      data: 'string',
      onRender: ({durationYears}) => {
        return <span>{durationYears + ` Year${durationYears > 1 ? 's' : ''}`}</span>;
      },
      isPadded: true
    },
    {
      key: 'description',
      name: 'Description',
      fieldName: 'description',
      minWidth: 150,
      maxWidth: 350,
      isResizable: true,
      data: 'string',
      onRender: ({school: {description}}) => {
        return <span>{description}</span>;
      },
      isPadded: true
    }
  ];

  _actions = {
    key: 'actions',
    name: 'Actions',
    fieldName: 'schools',
    minWidth: 50,
    maxWidth: 50,
    onRender: (item) => {
      return (<IconButton
        style={{height: 'auto'}}
        allowDisabledFocus={true}
        menuIcon={{iconName: 'MoreVertical'}}
        menuProps={{
          items: [
            {
              key: 'edit',
              text: 'Edit',
              iconProps: {iconName: 'Edit', style: {color: '#000'}},
              onClick: () => this.editSchool(item)
            },
            {
              key: 'delete',
              text: 'Delete',
              iconProps: {iconName: 'Delete', style: {color: '#000'}},
              onClick: () => this._openDeleteDialog(item)
            }

          ],
          directionalHintFixed: true
        }}
        split={false}
      />);
    },
    isPadded: true
  };

  state = {
    showPanel: false,
    hideDialog: true,
    schoolToDelete: null,
    schoolToEdit: null
  };

  componentDidMount() {
    const {user, getUserSchools, schools, getSchools, employeeId, getEmployee} = this.props;
    if (user) {
      getEmployee(employeeId);
      getUserSchools(employeeId);
      if (!schools)
        getSchools();
    }
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (((this.props.isStaff) || (this.props.employee && this.props.user && this.props.employee.id === this.props.user.id)) && (this._columns.length === 4))
      this._columns.push(this._actions);
    
    const {userSchools, editUserSchoolState} = this.props;
    if ((userSchools && nextProps.userSchools && (userSchools.length !== nextProps.userSchools.length)) ||
      ((editUserSchoolState && this.state.schoolToEdit) &&
        (editUserSchoolState === this.state.schoolToEdit.id))) {
      const {showPanel, hideDialog} = this.state;
      !hideDialog && this._closeDialog();
      showPanel && this._setShowPanel(false)();
    }

    const {getUserSchools, employeeId, getEmployee} = this.props;
    const {employeeId: nextId} = nextProps;
    if ((nextId !== employeeId)) {
      getEmployee(nextId);
      getUserSchools(nextId);
    }
  }

  render() {
    const {schoolToEdit, showPanel, hideDialog, schoolToDelete} = this.state;
    return (
      <div className={'page-container'}>
        <PageTitle title="Schools"/>
        <div className={'add-button'}>
          <AddButton title="Add a School" onClick={this._setShowPanel(true)}/>
          <Panel
            isBlocking={false}
            isOpen={showPanel}
            onDismiss={this._setShowPanel(false)}
            type={PanelType.smallFixedFar}
            headerText={schoolToEdit ? 'Add a School' : 'Edit a school'}
            hasCloseButton={false}
          >
            <SchoolsForm onClose={this._setShowPanel(false)} userSchool={schoolToEdit}/>
          </Panel>
        </div>
        {
          this.props.userSchools ?
            <DetailsList
              items={this.props.userSchools}
              columns={this._columns}
              selectionMode={SelectionMode.none}
              layoutMode={DetailsListLayoutMode.justified}
            /> :
            <Loader title="Loading your schools..."/>
        }
        <Dialog
          hidden={hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal,
            title: `Delete school ${schoolToDelete && schoolToDelete.school.name}`,
            subText:
              'This can not be undone.'
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false
          }}
        >
          <DialogFooter>
            <PrimaryButton
              iconProps={{iconName: 'Delete'}}
              onClick={() => {
                this.deleteSchool(schoolToDelete.id);
              }} text="Delete"/>
            <DefaultButton onClick={this._closeDialog} text="Cancel"/>
          </DialogFooter>
        </Dialog>
      </div>
    );
  }

  _closeDialog = () => {
    this.setState({hideDialog: true});
  };

  _setShowPanel = (showPanel) => {
    return () => {
      this.setState({schoolToEdit: null, showPanel});
    };
  };
}

const mapStateToProps = ({user, userSchools, schools, editUserSchoolState, employee, isStaff}, {match: {params: {employeeId}}}) => {
  return {user, userSchools, schools, editUserSchoolState, employeeId, employee, isStaff};
};

const mapDispatchToProps = (dispatch) => {
  return {
    getUserSchools: (userId) => dispatch(getUserSchools(userId)),
    getSchools: () => dispatch(getSchools()),
    deleteSchool: (userId, schoolId) => dispatch(deleteUserSchool(userId, schoolId)),
    getEmployee: (userId) => dispatch(getEmployee(userId)),
  };
};

export const EmployeeSchools = connect(mapStateToProps, mapDispatchToProps)(SchoolsPage);