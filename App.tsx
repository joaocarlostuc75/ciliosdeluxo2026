
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import BottomNav from './components/BottomNav';
import { Page, Service, User, Appointment, Client } from './types';
import { SERVICES as INITIAL_SERVICES } from './constants';

// Pages
import SplashScreen from './pages/SplashScreen';
import Home from './pages/Home';
import ServiceDetails from './pages/ServiceDetails';
import About from './pages/About';
import Booking from './pages/Booking';
import Profile from './pages/Profile';
import Confirmation from './pages/Confirmation';
import AdminLogin from './pages/AdminLogin';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>(Page.SPLASH);
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null);
  
  // Admin Credentials State
  const [adminPassword, setAdminPassword] = useState<string>('admin123');
  
  // Date Logic - Current "Real World" Date
  const today = new Date();
  
  const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  // Calendar View State (The month currently being looked at)
  const [viewDate, setViewDate] = useState<Date>(today);
  
  // Selected Appointment State
  const [selectedDay, setSelectedDay] = useState<number>(today.getDate());
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(today.getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(today.getFullYear());
  const [selectedTime, setSelectedTime] = useState<string>('10:00');
  
  // Computed values for View
  const viewYear = viewDate.getFullYear();
  const viewMonthIndex = viewDate.getMonth();
  const viewMonthName = monthNames[viewMonthIndex];

  // Dark mode Logic
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const [isAdmin, setIsAdmin] = useState(false);
  const [reschedulingId, setReschedulingId] = useState<string | null>(null);
  
  // Generate available days for the VIEWED month
  const [availableDays, setAvailableDays] = useState<number[]>([]);

  useEffect(() => {
    const daysInViewMonth = new Date(viewYear, viewMonthIndex + 1, 0).getDate();
    const days: number[] = [];
    
    // Check if looking at current month/year to block past days
    const isCurrentMonthView = viewYear === today.getFullYear() && viewMonthIndex === today.getMonth();
    const startDay = isCurrentMonthView ? today.getDate() : 1;
    
    // Check if looking at a past month (shouldn't happen with UI logic, but for safety)
    const isPastMonth = viewYear < today.getFullYear() || (viewYear === today.getFullYear() && viewMonthIndex < today.getMonth());

    if (!isPastMonth) {
      for (let d = startDay; d <= daysInViewMonth; d++) {
        const weekDay = new Date(viewYear, viewMonthIndex, d).getDay();
        if (weekDay !== 0) { // Closed on Sundays
          days.push(d);
        }
      }
    }
    setAvailableDays(days);
  }, [viewYear, viewMonthIndex]);
  
  // Calendar Navigation Handlers
  const handleNextMonth = () => {
    setViewDate(new Date(viewYear, viewMonthIndex + 1, 1));
  };

  const handlePrevMonth = () => {
    const prevMonthDate = new Date(viewYear, viewMonthIndex - 1, 1);
    // Prevent going back before current month
    if (prevMonthDate.getFullYear() < today.getFullYear() || 
       (prevMonthDate.getFullYear() === today.getFullYear() && prevMonthDate.getMonth() < today.getMonth())) {
      return;
    }
    setViewDate(prevMonthDate);
  };

  const handleSelectDate = (day: number) => {
    setSelectedDay(day);
    setSelectedMonthIndex(viewMonthIndex);
    setSelectedYear(viewYear);
  };

  // All appointments (for admin view)
  const [allAppointments, setAllAppointments] = useState<Appointment[]>([
    { id: '1', serviceId: 'fio-a-fio', serviceName: 'Fio a Fio', clientName: 'Alice Silva', clientWhatsapp: '11999999999', date: today.getDate() - 2, month: monthNames[today.getMonth()], time: '09:00', status: 'completed', price: 'R$ 130,00' },
    { id: '2', serviceId: 'volume-russo', serviceName: 'Volume Russo', clientName: 'Beatriz Costa', clientWhatsapp: '11888888888', date: today.getDate() + 1, month: monthNames[today.getMonth()], time: '14:00', status: 'upcoming', price: 'R$ 130,00' },
  ]);

  // Client database
  const [clients, setClients] = useState<Client[]>([
    { id: 'c1', name: 'Alice Silva', whatsapp: '11999999999', email: 'alice@mail.com', totalSpent: 130 },
    { id: 'c2', name: 'Beatriz Costa', whatsapp: '11888888888', email: 'beatriz@mail.com', totalSpent: 0 },
  ]);

  // Studio branding
  const [studio, setStudio] = useState<User>({
    name: 'Cílios de Luxo Studio',
    ownerName: 'Admin',
    whatsapp: '+55 (11) 98102-8614',
    address: 'Av. Brigadeiro Faria Lima, 2000 - São Paulo',
    email: 'contato@ciliosdeluxo.com',
    image: '',
    history: 'Fundado com o propósito de elevar a autoestima feminina, o Studio Cílios de Luxo nasceu da paixão pela excelência no olhar. Ao longo dos anos, transformamos milhares de olhares com técnicas exclusivas e atendimento personalizado de alto padrão.',
    mission: 'Proporcionar uma experiência de beleza inigualável, aliando técnicas avançadas ao conforto absoluto, para que cada cliente se sinta única e empoderada.',
    team: [
      { id: '1', name: 'Dra. Marianna Gold', role: 'Master Lash Specialist', image: 'https://picsum.photos/seed/pro/100/100' }
    ]
  });

  const [client, setClient] = useState<User>({
    name: 'Maria Valentina',
    whatsapp: '11987654321',
    address: '',
    email: 'maria.v@exemplo.com',
    appointments: [
      { id: 'h1', serviceId: 'volume-brasileiro', serviceName: 'Volume Brasileiro', date: today.getDate() + 5, month: monthNames[today.getMonth()], time: '15:30', status: 'upcoming', price: 'R$ 130,00', clientName: 'Maria Valentina', clientWhatsapp: '11987654321' },
    ]
  });

  const selectedService = services.find(s => s.id === selectedServiceId) || null;

  const navigateToService = (service: Service) => {
    setSelectedServiceId(service.id);
    setCurrentPage(Page.SERVICE_DETAILS);
  };

  // CRUD Handlers
  const handleUpdateService = (updated: Service) => setServices(prev => prev.map(s => s.id === updated.id ? updated : s));
  const handleDeleteService = (id: string) => setServices(prev => prev.filter(s => s.id !== id));
  const handleAddService = (service: Service) => setServices(prev => [...prev, service]);

  const handleUpdateAppointment = (updated: Appointment) => {
    setAllAppointments(prev => prev.map(a => a.id === updated.id ? updated : a));
    if (updated.clientWhatsapp === client.whatsapp) {
      setClient(prev => ({
        ...prev,
        appointments: prev.appointments?.map(a => a.id === updated.id ? updated : a)
      }));
    }
  };

  const handleCancelAppointment = (id: string) => {
    const app = allAppointments.find(a => a.id === id);
    if (app) {
      handleUpdateAppointment({ ...app, status: 'cancelled' });
    }
  };

  const handleRescheduleAppointment = (id: string) => {
    const app = allAppointments.find(a => a.id === id);
    if (app) {
      setReschedulingId(id);
      setSelectedServiceId(app.serviceId);
      
      // Try to match the month name to index to set the View
      const mIndex = monthNames.indexOf(app.month);
      if (mIndex >= 0) {
        setViewDate(new Date(today.getFullYear(), mIndex, 1)); // Simplified year handling
        setSelectedMonthIndex(mIndex);
      }
      
      setSelectedDay(app.date);
      setSelectedTime(app.time);
      setCurrentPage(Page.BOOKING);
    }
  };

  const handleDeleteAppointment = (id: string) => setAllAppointments(prev => prev.filter(a => a.id !== id));
  const handleUpdateClient = (updated: Client) => setClients(prev => prev.map(c => c.id === updated.id ? updated : c));
  const handleDeleteClient = (id: string) => setClients(prev => prev.filter(c => c.id !== id));

  const checkAvailability = (date: number, time: string, serviceId: string, excludeId?: string | null) => {
    // Check against all appointments
    return !allAppointments.some(a => 
      a.date === date && 
      a.month === monthNames[selectedMonthIndex] && // Use selected month logic
      a.time === time && 
      a.serviceId === serviceId && 
      a.status !== 'cancelled' &&
      a.id !== excludeId
    );
  };

  const handleAddAppointment = (app: Appointment) => {
    if (reschedulingId) {
      setAllAppointments(prev => prev.filter(a => a.id !== reschedulingId));
      setClient(prev => ({
        ...prev,
        appointments: prev.appointments?.filter(a => a.id !== reschedulingId)
      }));
      setReschedulingId(null);
    }

    setAllAppointments(prev => [app, ...prev]);
    setClient(prev => ({ ...prev, appointments: [app, ...(prev.appointments || [])] }));
    
    if (!clients.find(c => c.whatsapp === client.whatsapp)) {
      setClients(prev => [...prev, {
        id: Date.now().toString(),
        name: client.name,
        whatsapp: client.whatsapp,
        email: client.email,
        totalSpent: 0
      }]);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case Page.SPLASH:
        return <SplashScreen studio={studio} onStart={() => setCurrentPage(Page.HOME)} />;
      case Page.HOME:
        return <Home services={services} onSelectService={navigateToService} />;
      case Page.SERVICE_DETAILS:
        return selectedService ? (
          <ServiceDetails 
            service={selectedService} 
            isAdmin={isAdmin}
            onBack={() => setCurrentPage(Page.HOME)} 
            onBook={() => {
              setReschedulingId(null);
              // Reset selection to current date when starting new booking
              setSelectedDay(today.getDate());
              setSelectedMonthIndex(today.getMonth());
              setSelectedYear(today.getFullYear());
              setViewDate(today);
              setCurrentPage(Page.BOOKING);
            }}
            onUpdate={handleUpdateService}
          />
        ) : <Home services={services} onSelectService={navigateToService} />;
      case Page.ABOUT:
        return <About studio={studio} setStudio={setStudio} isAdmin={isAdmin} />;
      case Page.BOOKING:
        return (
          <Booking 
            services={services}
            onConfirm={() => setCurrentPage(Page.CONFIRMATION)} 
            selectedService={selectedService} 
            
            // View State (Calendar Display)
            viewYear={viewYear}
            viewMonthName={viewMonthName}
            viewMonthIndex={viewMonthIndex}
            onNextMonth={handleNextMonth}
            onPrevMonth={handlePrevMonth}
            availableDays={availableDays}

            // Selection State
            selectedDate={selectedDay}
            setSelectedDate={handleSelectDate}
            selectedMonthIndex={selectedMonthIndex}
            selectedYear={selectedYear}
            
            selectedTime={selectedTime}
            setSelectedTime={setSelectedTime}
            setSelectedServiceId={setSelectedServiceId}
          />
        );
      case Page.PROFILE:
        return (
          <Profile 
            studio={studio} 
            setStudio={setStudio} 
            client={client}
            setClient={setClient}
            clients={clients}
            services={services}
            allAppointments={allAppointments}
            availableDays={availableDays} 
            setAvailableDays={setAvailableDays} 
            isAdmin={isAdmin}
            setIsAdmin={setIsAdmin}
            onNavigate={setCurrentPage}
            onUpdateService={handleUpdateService}
            onDeleteService={handleDeleteService}
            onAddService={handleAddService}
            onUpdateAppointment={handleUpdateAppointment}
            onDeleteAppointment={handleDeleteAppointment}
            onUpdateClient={handleUpdateClient}
            onDeleteClient={handleDeleteClient}
            onCancelAppointment={handleCancelAppointment}
            onRescheduleAppointment={handleRescheduleAppointment}
            currentYear={today.getFullYear()}
            adminPassword={adminPassword}
            setAdminPassword={setAdminPassword}
          />
        );
      case Page.ADMIN_LOGIN:
        return (
          <AdminLogin 
            adminPassword={adminPassword}
            onLogin={() => {
              setIsAdmin(true);
              setCurrentPage(Page.PROFILE);
            }} 
            onBack={() => setCurrentPage(Page.PROFILE)}
          />
        );
      case Page.CONFIRMATION:
        return (
          <Confirmation 
            client={client} 
            setClient={setClient} 
            studioWhatsapp={studio.whatsapp} 
            selectedService={selectedService}
            // Pass the SELECTED date info, not current
            selectedDate={selectedDay}
            selectedTime={selectedTime}
            currentMonthName={monthNames[selectedMonthIndex]} 
            currentYear={selectedYear}
            currentMonthIndex={selectedMonthIndex}
            onConfirmBooking={handleAddAppointment}
            checkAvailability={(d, t, s) => checkAvailability(d, t, s, reschedulingId)}
            onFinish={() => setCurrentPage(Page.HOME)} 
          />
        );
      default:
        return <Home services={services} onSelectService={navigateToService} />;
    }
  };

  const showNav = ![Page.SPLASH, Page.CONFIRMATION, Page.ADMIN_LOGIN].includes(currentPage);

  return (
    <Layout 
      activePage={currentPage} 
      onNavigate={setCurrentPage}
      studio={studio}
      darkMode={darkMode}
      toggleDarkMode={toggleDarkMode}
    >
      {renderPage()}
      {showNav && (
        <div className="md:hidden">
          <BottomNav activePage={currentPage} onNavigate={setCurrentPage} />
        </div>
      )}
    </Layout>
  );
};

export default App;
