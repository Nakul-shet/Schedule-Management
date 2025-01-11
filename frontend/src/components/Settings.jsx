import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";
import { CONFIG } from "../config";
import moment from "moment";
import { DateLocalizer } from "react-big-calendar";

const Settings = () => {
    const [status, setStatus] = useState({
      isAuthenticated: false,
      qrCodeData: null,
      isLoading: true,
      retryCount: 0,
      maxRetries: 3
    });
  
    useEffect(() => {
      const checkStatus = async () => {
        try {
          const response = await fetch(`${CONFIG.runEndpoint.backendUrl}/api/whatsapp/status`);
          const data = await response.json();
          
          if (!data.isAuthenticated) {
            const qrResponse = await fetch(`${CONFIG.runEndpoint.backendUrl}/api/whatsapp/qr`);
            const qrData = await qrResponse.json();
            
            setStatus({
              isAuthenticated: data.isAuthenticated,
              qrCodeData: qrData.qrCode,
              isLoading: false,
              retryCount: data.retryCount,
              maxRetries: data.maxRetries
            });
  
            // Set up polling if not authenticated
            const timer = setTimeout(checkStatus, 5000);
            return () => clearTimeout(timer);
          } else {
            setStatus(prev => ({
              ...prev,
              isAuthenticated: true,
              isLoading: false
            }));
          }
        } catch (error) {
          console.error('Error fetching status:', error);
        }
      };
  
      checkStatus();
    }, []);
  
    const renderContent = () => {
      if (status.isLoading) {
        return (
          <>
            <h2 className="text-emerald-700 mb-4">Initializing WhatsApp...</h2>
            <p className="text-gray-600">Please wait while we prepare the QR code</p>
            <p className="text-gray-400 text-sm mt-5">Page will automatically refresh...</p>
          </>
        );
      }
  
      if (status.isAuthenticated) {
        return (
          <>
            <div className="text-green-500 text-5xl mb-5">✓</div>
            <h2 className="text-emerald-700 mb-4">WhatsApp Successfully Connected!</h2>
            <p className="text-green-500 text-xl my-5">Your WhatsApp service is ready and running</p>
          </>
        );
      }
  
      if (status.qrCodeData) {
        return (
          <>
            <h2 className="text-emerald-700 mb-4">Scan this QR code in WhatsApp</h2>
            <img 
              src={status.qrCodeData} 
              alt="WhatsApp QR Code"
              className="max-w-[300px] h-auto mx-auto"
            />
            <p className="text-gray-600 mt-4">
              Attempt {status.retryCount} of {status.maxRetries}
            </p>
            <p className="text-gray-400 text-sm mt-5">
              Page will automatically refresh until connected...
            </p>
          </>
        );
      }
    };
  
    return (
        <section className="page">
            <div className="header">
                <h1>Settings</h1>
            </div>
            <div className="flex justify-center items-center min-h-screen bg-gray-100">
                <h3>WhatsApp Connectivity</h3>
                <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md w-[90%]">
                {renderContent()}
                </div>
            </div>
        </section>
    );
  };
  
  export default Settings;
