import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { User, UserData, DataItem, FilterState, MetricType, AttributeType, GroupedData } from '../types';

interface DashboardContextType {
  users: User[];
  currentUser: User | null;
  userData: DataItem[];
  filters: FilterState;
  groupedData: GroupedData;
  setCurrentUser: (user: User) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  resetFilters: () => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

const defaultFilters: FilterState = {
  startDate: null,
  endDate: null,
  sector: [],
  category: [],
  attributes: [],
  metrics: [],
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [allUserData, setAllUserData] = useState<UserData[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<DataItem[]>([]);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [groupedData, setGroupedData] = useState<GroupedData>({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/db.json');
        const data = await response.json();
        setUsers(data.users);
        setAllUserData(data.data);
        
        if (data.users.length > 0 && !currentUser) {
          setCurrentUser(data.users[0]);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Update user data when current user changes
  useEffect(() => {
    if (currentUser && allUserData.length > 0) {
      const userDataItems = allUserData.find(data => data.userId === currentUser.id)?.items || [];
      setUserData(userDataItems);
    }
  }, [currentUser, allUserData]);

  useEffect(() => {
    if (userData.length === 0) return;

    const groupData = () => {
      const grouped: GroupedData = {};
      
      const attributesToGroup = filters.attributes.length > 0 
        ? filters.attributes 
        : ['country', 'state', 'city', 'sector', 'category'] as AttributeType[];
      
      const metricsToShow = filters.metrics.length > 0 
        ? filters.metrics 
        : ['mySpend', 'sameStoreSpend', 'newStoreSpend', 'lostStoreSpend'] as MetricType[];
      
      let filteredData = [...userData];
      
      if (filters.sector.length > 0) {
        filteredData = filteredData.filter(item => filters.sector.includes(item.sector));
      }
      
      if (filters.category.length > 0) {
        filteredData = filteredData.filter(item => filters.category.includes(item.category));
      }
      
      if (filters.startDate && filters.endDate) {
        const startDate = new Date(filters.startDate);
        const endDate = new Date(filters.endDate);
        
        filteredData = filteredData.filter(item => {
          const itemStartDate = new Date(item.startDate);
          const itemEndDate = new Date(item.endDate);
          
          return (
            (itemStartDate >= startDate && itemStartDate <= endDate) ||
            (itemEndDate >= startDate && itemEndDate <= endDate) ||
            (itemStartDate <= startDate && itemEndDate >= endDate)
          );
        });
      }
      
      filteredData.forEach(item => {
        const groupKey = attributesToGroup.map(attr => item[attr as keyof DataItem]).join(' - ');
        
        if (!grouped[groupKey]) {
          grouped[groupKey] = {};
        }
        
        metricsToShow.forEach(metric => {
          if (!grouped[groupKey][metric]) {
            grouped[groupKey][metric] = {
              current: 0,
              reference: 0,
              absoluteChange: 0,
              percentChange: 0,
            };
          }
          
          grouped[groupKey][metric].current += item[metric].current;
          grouped[groupKey][metric].reference += item[metric].reference;
          grouped[groupKey][metric].absoluteChange += item[metric].absoluteChange;
          
          if (grouped[groupKey][metric].reference !== 0) {
            grouped[groupKey][metric].percentChange = 
              ((grouped[groupKey][metric].current - grouped[groupKey][metric].reference) / 
              grouped[groupKey][metric].reference) * 100;
          } else {
            grouped[groupKey][metric].percentChange = 0;
          }
        });
      });
      
      return grouped;
    };
    
    setGroupedData(groupData());
  }, [userData, filters]);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <DashboardContext.Provider
      value={{
        users,
        currentUser,
        userData,
        filters,
        groupedData,
        setCurrentUser,
        updateFilters,
        resetFilters,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};