import { useContext, useEffect, useState } from "react";

import AddClientForm from "../../components/AddClientForm/AddClientForm";
import MainButton from "../../components/Buttons/MainButton/MainButton";
import BackButton from "../../components/Buttons/BackButton/BackButton";
import Spinner from "../../components/Spinner/Spinner";
import CustomerData from "./CustomerData";

import request from "../../helpers/request";
import { StoreContext } from "../../Store/StoreProvider";

import styles from "./Customers.module.scss";

const Customers = () => {
  const {
    clientsData,
    setClientsData,
    addClientModalOpen,
    setAddClientModalOpen,
    showSpinner,
    setShowSpinner,
  } = useContext(StoreContext);

  const [clientAdded, setClientAdded] = useState(false);
  const [clientEdited, setClientEdited] = useState(false);
  const [clientRemoved, setClientRemoved] = useState(false);

  const showInformationAdded = clientAdded ? "Dodano nowego klienta" : "";
  const showInformationRemoved = clientRemoved ? "Usunieto klienta" : "";
  const spinner = showSpinner ? <Spinner /> : "";

  //all clients from handleGetClients
  const clientsInfo = clientsData.map((client) => (
    <CustomerData
      key={client._id}
      client={client}
      setClientRemoved={setClientRemoved}
    />
  ));

  useEffect(() => {
    const timeout = setTimeout(() => {
      setClientAdded(false);
      setClientRemoved(false);
    }, 3000);

    return () => clearInterval(timeout);
  }, [clientAdded, clientRemoved]);

  const handleModalOpen = () => {
    setAddClientModalOpen(true);
  };

  const handleCloseModal = () => {
    setAddClientModalOpen(false);
  };

  const handleSerchModalOpen = () => {};

  const handleGetClients = async () => {
    setShowSpinner(true);
    const { data, status } = await request.get("/clients");
    console.log(status);
    if (status === 200) {
      setShowSpinner(false);
      setClientsData(data.data);
    } else {
      setShowSpinner(false);
      console.log(data.message);
    }
  };
  const getAllClientsButton =
    clientsData.length === 0 ? (
      <MainButton name="lista kontrahentów" onClick={handleGetClients} />
    ) : (
      ""
    );

  return (
    <div className={styles.wrapper}>
      <h1>Moduł klienta</h1>
      <div className={styles.information}>
        <p>{showInformationAdded}</p>
        <p>{showInformationRemoved}</p>
      </div>
      <div className={styles.selectButttons}>
        <MainButton name="dodaj kontrahenta" onClick={handleModalOpen} />
        <AddClientForm
          isModalOpen={addClientModalOpen}
          handleOnClose={handleCloseModal}
          setClientAdded={setClientAdded}
        />
        <MainButton
          name="wyszukaj kontrahenta"
          onClick={handleSerchModalOpen}
        />
        {getAllClientsButton}
      </div>
      {spinner}
      <div className={styles.clientItem}></div>
      <div className={styles.clientsList}>{clientsInfo}</div>
      <div className={styles.backButton}>
        <BackButton />
      </div>
    </div>
  );
};

export default Customers;
