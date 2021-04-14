import React, { useEffect, useState } from 'react';
import Compra from '../components/Compra';
import Cookie from 'universal-cookie';
import axios from 'axios';
import {useHistory} from 'react-router-dom';
import Load from '../components/Load'
import Modal from '../components/Modal';

const Carrito = ()=>{

    const [compras, setCompras] = useState([]);
    const [costo, setCosto] = useState(0);
    const [load, setLoad] = useState(false);
    const [modal, setModal] = useState(false);
    const cookies = new Cookie();
    let history = useHistory();

    const getCompras = async ()=>{
        const res = await axios.get(`http://localhost:4000/api/compras/${cookies.get('id')}`);
        setCompras(res.data[0].compras);
        const numeros = res.data[0].compras.map(precio=>parseInt(precio.precio.replace(",","").split(".")[0]));
        const suma = numeros.reduce((acc, item)=>{
            return acc = acc + item;
        });
        setCosto(suma);
        setLoad(false);
    };

    useEffect(()=>{
        if (cookies.get('auth')) {
            setLoad(true);
            getCompras();   
        }else{
            history.push('/');
        }
    },[]);

    const handleRemove = async i =>{
        setLoad(true);
        await axios.put(`http://localhost:4000/api/compras/${cookies.get('id')}`,{
            idProduct: i
        });
        getCompras();
        setLoad(false);
    }

    const handleConfirm = ()=>{
        setModal(true);
    }

    if (load) {
        return <Load/>
    }
    return(
        <div className="carrito">
            <Modal className='open modal'/>
            <h2 className="carrito-title">Carrito</h2>
            {compras.map(compra =>(
                <Compra onClick={handleRemove} confirm={handleConfirm} key={compra._id} id={compra._id} nombre={compra.nombre} precio={compra.precio} img={compra.urlImg} departamento={compra.departamento}/>
            ))}
            <button className="carrito-button btn-primary">Comprar todo $ {costo} Mxn.</button>
        </div>
    );
};

export default Carrito;