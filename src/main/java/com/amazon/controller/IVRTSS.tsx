import React from 'react';
import {StencilProvider} from '@amzn/stencil-react-components/context';
import {Button} from '@amzn/stencil-react-components/button';
import {H1, Text} from '@amzn/stencil-react-components/text';
import {PageContainer} from '@amzn/stencil-react-components/page';
import {Col, Row, View} from '@amzn/stencil-react-components/layout';
import {Table, TableSpacing} from '@amzn/stencil-react-components/table';
import {Avatar} from '@amzn/stencil-react-components/avatar';
import {
    FormWrapper,
    InputWrapper,
    Select,
    TextArea,
    TextAreaWithRecommendedLength
} from '@amzn/stencil-react-components/form';
import {Modal, ModalContent} from '@amzn/stencil-react-components/modal';
import {PageProps} from '../models/FederateData';
import {HR2021Theme} from '@amzn/stencil-react-theme-default';
import AuthService from '../services/AuthService';
import CustomFooter from '../components/CustomFooter';
import CustomBackToTop from '../components/CustomBackToTop';
import CustomHeader from '../components/CustomHeader';
import LDAP from '../models/LDAP';
import {Spinner} from '@amzn/stencil-react-components/spinner';
import {IconCrossSmall} from '@amzn/stencil-react-components/icons';
import SignedOut from './SignedOut';
import Forbidden from './Forbidden';
import axios from 'axios';
import 'react-phone-number-input/style.css';
import PhoneInput from 'react-phone-number-input';
import {Popover, PopoverPosition} from '@amzn/stencil-react-components/popover';
import {TabBar, TabPanel, TabsLayout, TabSwitcher, TabValue} from '@amzn/stencil-react-components/tabs';
import errorHandling from '../components/ErrorHandler';
import {MessageBanner, MessageBannerType} from '@amzn/stencil-react-components/message-banner';
import {headers, IVRTableData} from '../models/IVRTextSelfServiceState';
import {tabs} from '../models/CustomTabs';
import {getColumnsChangelog, getColumnsChangelogFiltered, getColumnsIVR} from '../models/SelfServiceTableData';


const authService: AuthService = new AuthService();

interface SelfServiceState {
    fetchedDataForDropdown: any,
    fetchedDataForTableRows: any,
    fetchedChangelogData: any,
    fetchedChangelogDataFiltered: any,
    isOpen: boolean,
    loading: boolean,
    isPostError: any,
    isPostSuccess: boolean,
    readyToRedirect: boolean,
    phone: any,
    tabValue: TabValue
}

export default class IVRTSS extends React.Component<PageProps, SelfServiceState> {
    smsType: string = '';
    showTableMain: boolean = false;
    isFiltered: boolean = false;
    showNumberOfRows: boolean = false;

    state: SelfServiceState = {
        fetchedDataForDropdown: [],
        fetchedDataForTableRows: [],
        fetchedChangelogDataFiltered: [],
        fetchedChangelogData: [],
        isOpen: false,
        loading: true,
        isPostError: '',
        isPostSuccess: false,
        readyToRedirect: false,
        phone: '',
        tabValue: tabs[0]
    };

    tableData: IVRTableData = {
        smsBody: ''
    };

    updatedTableData: IVRTableData = {
        smsBody: ''
    };
    body = {
        'smsType': 'COVID1'
    };

    constructor(props: PageProps) {
        super(props);
    }

    setLoadingValue() {
        this.setState({loading: true});
    }

    componentDidMount() {
        axios.get('http://localhost:8080/', {
            headers: headers
        }).then(({data}) => {
            this.setState({fetchedDataForDropdown: data, loading: false});
        })
            .catch((error) => {
                console.log(error);
            });

        axios.get('http://localhost:8080/smsTypeCH', {
            headers: headers,
            params: {
                'smsTypeCH': this.smsType
            }
        }).then(({data}) => {
            this.setState({fetchedChangelogData: data, loading: false});
        })
            .catch((error) => {
                console.log(error);
            });
    }

    getTableData() {
        this.setLoadingValue();
        axios.get('http://localhost:8080/smsType', {
            headers: headers,
            params: {
                'smsType': this.smsType
            }
        }).then(({data}) => {
            this.setState({fetchedDataForTableRows: data, loading: false});
        })
            .catch((error) => {
                console.log(error);
            });
    }

    updateTableData(body: IVRTableData) {
        this.setLoadingValue();
        axios.post('http://localhost:8080/smsType', body, {
            headers: headers,
            params: {
                'smsType': 'COVID1'
            }
        }).then(({data}) => {
            this.setState({fetchedDataForTableRows: data, loading: false, isPostSuccess: true});
            this.updatedTableData = {
                smsBody: ''
            };
        })
            .catch((error) => {
                errorHandling(error);
                this.setState({loading: false, isPostError: error.message});
                this.updatedTableData = {
                    smsBody: ''
                };
            });
    }

    sendSMS(body: IVRTableData) {
        this.setLoadingValue();
        axios.post('http://localhost:8080/sendSMS', body, {
            headers: headers,
            params: {
                'phone': this.state.phone
            }
        }).then(({data}) => {
            this.setState({loading: false, isPostSuccess: true});
        })
            .catch((error) => {
                errorHandling(error);
                this.setState({loading: false, isPostError: error.response.data});
            });
    }

    handleSubmit = (event: any) => {
        event.preventDefault();
        this.updateTableData(this.updatedTableData);
    };

    handleSubmitSMS = (event: any) => {
        event.preventDefault();
        this.sendSMS(this.updatedTableData);
    };

    close = () => this.setState({isOpen: false});

    getColumnFiltered(smsType: string) {
        this.isFiltered = true;
        this.setState({fetchedChangelogDataFiltered: this.state.fetchedChangelogData.filter((row: any) => row.smsType === smsType)});
    }

    getModal() {
        return (
            <>
                <Table isStriped={true} getRowAttributes={this.getRowAttributes}
                       columns={getColumnsIVR}
                       data={this.state.fetchedDataForTableRows} actionHeader={'Edit'} spacing={TableSpacing.Default}
                       shouldAutoCollapseOnExpand={true} shouldScrollHorizontally={true}/>
                <Modal isScrollable={false} shouldCloseOnClickOutside={false} isOpen={this.state.isOpen}
                       close={this.close}>
                    <ModalContent
                        maxWidth={1050}
                        buttons={[
                            <Button
                                primary
                                onClick={(event) => {
                                    this.close();
                                    this.handleSubmit(event);
                                }}
                                justifyContent='center'
                                alignSelf='center'
                                type='submit'> Submit </Button>,
                            <Button
                                justifyContent='left'
                                alignSelf='left'
                                onClick={this.close}
                                key='Close'
                                hasIcon
                                destructive
                                tertiary>
                                <Row alignItems='center'>
                                    <IconCrossSmall aria-hidden={true}/>
                                    Discard
                                </Row>
                            </Button>
                        ]}>
                        <Text fontSize='T400'>{this.smsType}</Text>
                        <br/>
                        <FormWrapper
                            padding='S500' maxWidth={750} width={750}>
                            <InputWrapper id='text-preview-1'
                                          labelText='SMS Body'
                                          footerText='Enter the updated SMS Template here'>
                                {() => <TextArea
                                    height={250}
                                    resize='vertical'
                                    defaultValue={this.tableData.smsBody}
                                    onChange={(event) => {
                                        this.updatedTableData.smsBody = event.target.value;
                                    }}
                                />}
                            </InputWrapper>

                            <Popover triggerText='Preview SMS' shouldFocusOnOpen={true} shouldCloseOnFocusLeave={false}
                                     position={PopoverPosition.BottomCenter}>
                                {({close}) => (
                                    <Col gridGap='S400' padding='S300'>
                                        <Text>
                                            Enter the phone number below to send the above SMS Text.
                                        </Text>
                                        {
                                            this.state.isPostSuccess &&
                                            <MessageBanner aria-live='off' iconAltText='Successful'
                                                           type={MessageBannerType.Success}
                                                           isDismissible
                                                           onDismissed={() => {
                                                               this.setState({isPostSuccess: false});
                                                           }}>
                                                The SMS is sent successfully.
                                            </MessageBanner>
                                        }
                                        {
                                            this.state.isPostError !== '' &&
                                            <MessageBanner aria-live='off' iconAltText='Failure'
                                                           type={MessageBannerType.Error}
                                                           isDismissible
                                                           onDismissed={() => this.setState({isPostError: ''})}>
                                                There seems to be an issue - {this.state.isPostError}
                                            </MessageBanner>
                                        }
                                        <FormWrapper
                                            padding='S300' maxWidth={400} width={400}>
                                            <Row padding='S500' gridGap='S500'>
                                                <PhoneInput
                                                    international
                                                    countryCallingCodeEditable={false}
                                                    initialValueFormat='national'
                                                    inputExtraProps={{
                                                        name: 'phone',
                                                        required: true,
                                                        autoFocus: true
                                                    }}
                                                    defaultCountry='US'
                                                    placeholder='Enter phone number'
                                                    value={this.state.phone}
                                                    onChange={(value: any) => this.setState({phone: value})}
                                                />
                                                <Button
                                                    small
                                                    type='submit'
                                                    onClick={(event) => {
                                                        this.handleSubmitSMS(event);
                                                    }}>
                                                    Send SMS
                                                </Button>
                                            </Row>
                                        </FormWrapper>
                                        <Row gridGap='S300' justifyContent='flex-end' alignItems='center'>
                                            <Button tertiary small destructive onClick={close}
                                                    onChange={() => this.setState({isPostError: ''})}>
                                                Close Popup
                                            </Button>
                                        </Row>
                                    </Col>
                                )}
                            </Popover>

                            <InputWrapper id='text-preview-2'
                                          labelText='Comments'
                                          footerText='Ex: Changed Class M option 1 SMS to reflect new time-off regulations that went into place on 4/5.'>
                                {() => <TextAreaWithRecommendedLength resize='vertical' recommendedWordCount={30}/>}
                            </InputWrapper>

                        </FormWrapper>
                    </ModalContent>
                </Modal>
            </>
        );
    }

    getRowAttributes = () => ({
            onClick: () => {
                this.setState({isOpen: true});
                this.tableData.smsBody = this.state.fetchedDataForTableRows[0].smsBody;
                this.updatedTableData.smsBody = this.tableData.smsBody;
            }
        }
    );

    render() {

        if (!authService.isUserAuthenticated() && this.props.federateToken === null)
            return <SignedOut allowance={true}/>;

        if (this.state.readyToRedirect) {
            return <SignedOut allowance={true}/>;
        }

        if (!this.props.federateToken.LDAPGROUP.includes(LDAP[3].toString())) {
            return <Forbidden federateToken={this.props.federateToken} allowance={true}/>;
        }

        return (
            <div>
                <StencilProvider theme={{
                    ...HR2021Theme
                }}>
                    <View height={150}>
                        <CustomHeader federateToken={this.props.federateToken}/>
                        <Col margin={{left: 155}}>
                            {
                                authService.isTokenPresent() &&
                                <Avatar
                                    fullName={this.props.federateToken.FAMILY_NAME + ', ' + this.props.federateToken.GIVEN_NAME}
                                    username={this.props.federateToken.sub}
                                    usernameClickable={true}
                                    margin={25}>
                                </Avatar>
                            }
                        </Col>
                    </View>
                    <PageContainer
                        backgroundColor='primary05'
                        alignItems='center'
                        centered={true}
                        paddingBottom='S700'
                        paddingTop='S600'
                        paddingHorizontal='S600'>
                        <Col gridGap='S500' padding='S300' alignItems='center'>
                            <H1 textAlign='center'> IVR Text Self-Service </H1>
                            <TabBar
                                layout={TabsLayout.Default}
                                onTabSelect={(index) => {
                                    this.setState({tabValue: index});
                                }}
                                selectedTab={this.state.tabValue}
                                tabGroup='TabGroup-1'
                                tabs={tabs}
                            />
                            <TabSwitcher
                                selectedTab={this.state.tabValue}
                                tabGroup='TabGroup-1'>

                                <TabPanel value='Main Content'>
                                    <Col
                                        backgroundColor='primary05'
                                        alignItems='center'
                                        justifyContent='center'>
                                        {
                                            this.state.loading &&
                                            <StencilProvider theme={{
                                                ...HR2021Theme
                                            }}>
                                                <br/>
                                                <Col gridGap={35}>
                                                    <Spinner size={70} strokeWidth={9} showText textColor='neutral100'/>
                                                </Col>
                                                <br/>
                                            </StencilProvider>
                                        }
                                        <br/>
                                    </Col>
                                    <Row gridGap='S500' alignItems='center' justifyContent='flex-start'>
                                        <View minWidth='max-content'>
                                            <Text id='smsType-selector-label'>
                                                Choose SMS Type to filter:
                                            </Text>
                                        </View>
                                        <Select placeholder='Choose SMS Type' isSearchable={true}
                                                width='100%'
                                                options={this.state.fetchedDataForDropdown}
                                                onChange={value => {
                                                    this.smsType = value;
                                                    this.getTableData();
                                                    this.showTableMain = true;
                                                }}/>
                                    </Row>
                                    <br/>
                                    <Col
                                        backgroundColor='primary05'
                                        alignItems='center'
                                        justifyContent='center'>
                                        {this.showTableMain && this.getModal()}
                                        <br/>
                                    </Col>
                                    <br/>
                                </TabPanel>

                                <TabPanel value='Changelog'>
                                    <Col
                                        backgroundColor='primary05'
                                        alignItems='center'
                                        justifyContent='center'>
                                        {
                                            this.state.loading &&
                                            <StencilProvider theme={{
                                                ...HR2021Theme
                                            }}>
                                                <br/>
                                                <Col gridGap={35}>
                                                    <Spinner size={70} strokeWidth={9} showText textColor='neutral100'/>
                                                </Col>
                                                <br/>
                                            </StencilProvider>
                                        }
                                        <br/>
                                    </Col>
                                    <Row gridGap='S500' alignItems='center' justifyContent='flex-start'>
                                        <View minWidth='max-content'>
                                            <Text id='smsType-cl-selector-label'>
                                                Choose SMS Type to filter:
                                            </Text>
                                        </View>
                                        <Select placeholder='Choose SMS Type for change log' isSearchable={true}
                                                width='100%'
                                                options={this.state.fetchedDataForDropdown}
                                                onChange={value => {
                                                    this.getColumnFiltered(value);
                                                    this.showNumberOfRows = true;
                                                }}/>

                                        <View minWidth='max-content'>
                                            <Button
                                                onClick={() => {
                                                    //this.componentDidMount();
                                                    this.isFiltered = false;
                                                    window.location.href = '/IVRTextSS';
                                                }}
                                                justifyContent='center'
                                                alignSelf='center'>Refresh</Button>
                                        </View>

                                    </Row>
                                    <br/>
                                    <br/>
                                    <Col
                                        backgroundColor='primary05'
                                        alignItems='center'
                                        justifyContent='center'>
                                        {
                                            (!this.isFiltered) ?
                                                (<>
                                                    <Table isStriped={true}
                                                           columns={getColumnsChangelog}
                                                           data={this.state.fetchedChangelogData}
                                                           spacing={TableSpacing.Reduced}
                                                           shouldAutoCollapseOnExpand={true}
                                                           shouldScrollHorizontally={true}/>
                                                    <br/>
                                                </>)
                                                :
                                                (<>
                                                    {
                                                        this.showNumberOfRows &&
                                                        <Text fontSize='T200'>Filtered no. of
                                                            Rows: {this.state.fetchedChangelogDataFiltered.length}</Text>
                                                    }
                                                    <br/>
                                                    <Table isStriped={true}
                                                           columns={getColumnsChangelogFiltered}
                                                           data={this.state.fetchedChangelogDataFiltered}
                                                           spacing={TableSpacing.Reduced}
                                                           shouldAutoCollapseOnExpand={true}
                                                           shouldScrollHorizontally={true}/>
                                                    <br/>
                                                </>)
                                        }
                                    </Col>
                                </TabPanel>

                            </TabSwitcher>
                        </Col>
                        <br/>
                        <CustomBackToTop/>
                    </PageContainer>
                    <CustomFooter/>
                </StencilProvider>
            </div>
        );
    }
}
