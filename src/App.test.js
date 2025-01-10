import React, { useState, useEffect } from 'react';
import { Router, Globe, Network } from 'lucide-react';
import './App.css';

const NetworkTopology = () => {
  const [selectedNode, setSelectedNode] = useState(null);
  const [draggingNode, setDraggingNode] = useState(null);
  const [labelOffsets, setLabelOffsets] = useState({});
  const [devices, setDevices] = useState([
    // FAI Routers en haut
    { id: 'fai1', type: 'router', x: 800, y: 320, name: 'FAI-RT-01', ip: '80.0.0.6', color: '#ff6b6b', interfaces: [{ name: 'FastEthernet0/0', ip: '80.0.0.6' }, { name: 'FastEthernet0/1', ip: null }, { name: 'Serial0/0/0', ip: '80.0.0.14' }, { name: 'Serial0/0/1', ip: '80.0.0.17' }, { name: 'Serial0/1/0', ip: null }, { name: 'Serial0/1/1', ip: null }] },
    { id: 'fai2', type: 'router', x: 1150, y: 120, name: 'FAI-RT-02', ip: '80.0.0.9', color: '#ff6b6b', interfaces: [{ name: 'FastEthernet0/0', ip: null }, { name: 'FastEthernet0/1', ip: null }, { name: 'Serial0/0/0', ip: '80.0.0.9' }, { name: 'Serial0/0/1', ip: '80.0.0.13' }, { name: 'Serial0/1/0', ip: '80.0.0.22' }, { name: 'Serial0/1/1', ip: null }] },
    { id: 'fai3', type: 'router', x: 900, y: 120, name: 'FAI-RT-03', ip: '80.0.0.33', color: '#ff6b6b', interfaces: [{ name: 'FastEthernet0/0', ip: null }, { name: 'FastEthernet0/1', ip: null }, { name: 'Serial0/0/0', ip: '80.0.0.33' }, { name: 'Serial0/0/1', ip: '80.0.0.21' }, { name: 'Serial0/1/0', ip: '80.0.0.30' }, { name: 'Serial0/1/1', ip: null }] },
    { id: 'fai4', type: 'router', x: 600, y: 120, name: 'FAI-RT-04', ip: '80.0.0.18', color: '#ff6b6b', interfaces: [{ name: 'FastEthernet0/0', ip: null }, { name: 'FastEthernet0/1', ip: null }, { name: 'Serial0/0/0', ip: '80.0.0.18' }, { name: 'Serial0/0/1', ip: '80.0.0.34' }, { name: 'Serial0/1/0', ip: '80.0.0.26' }, { name: 'Serial0/1/1', ip: null }] },
    { id: 'fai5', type: 'router', x: 350, y: 120, name: 'FAI-RT-05', ip: '90.154.127.254', color: '#ff6b6b', interfaces: [{ name: 'FastEthernet0/0', ip: null }, { name: 'FastEthernet0/1', ip: null }, { name: 'Serial0/0/0', ip: '80.0.0.29' }, { name: 'Serial0/0/1', ip: '80.0.0.25' }, { name: 'Serial0/1/0', ip: '90.154.127.254' }, { name: 'Serial0/1/1', ip: null }] },
  
    // Core Routers
    { id: 'dslam', type: 'router', x: 450, y: 320, name: 'RT-DSLAM', ip: '80.0.0.5', color: '#4ecdc4', interfaces: [{ name: 'FastEthernet0/0', ip: '80.0.0.5' }, { name: 'FastEthernet0/1', ip: null }, { name: 'GigabitEthernet0/0/0', ip: '68.101.36.254' }, { name: 'GigabitEthernet0/1/0', ip: '131.50.62.254' }, { name: 'GigabitEthernet0/2/0', ip: '80.158.3.254' }, { name: 'GigabitEthernet0/3/0', ip: '45.80.255.254' }, { name: 'FastEthernet1/0', ip: '80.0.0.1' }] },
    { id: 'wan', type: 'router', x: 1400, y: 120, name: 'RT-WAN', ip: '108.177.127.254', color: '#4ecdc4', interfaces: [{ name: 'FastEthernet0/0', ip: null }, { name: 'FastEthernet0/1', ip: null }, { name: 'GigabitEthernet0/0/0', ip: '108.177.127.254' }, { name: 'Serial0/1/0', ip: '80.0.0.10' }, { name: 'Serial0/1/1', ip: null }, { name: 'GigabitEthernet0/2/0', ip: '8.8.8.254' }, { name: 'FastEthernet1/0', ip: '80.0.0.2' }] },
  
    // Client Routers
    { id: 'biblio', type: 'router', x: 200, y: 550, name: 'RT-BIBLIOTHEQUE', ip: '192.168.0.254', color: '#96ceb4', interfaces: [{ name: 'FastEthernet0/0', ip: '192.168.0.254' }, { name: 'FastEthernet0/1', ip: null }, { name: 'GigabitEthernet0/0/0', ip: '80.158.3.17' }] },
    { id: 'digi', type: 'router', x: 450, y: 550, name: 'DIGI-RT', ip: '192.168.70.200', color: '#96ceb4', interfaces: [{ name: 'FastEthernet0/0', ip: '192.168.70.200' }, { name: 'FastEthernet0/1', ip: null }, { name: 'GigabitEthernet0/0/0', ip: '68.101.36.129' }] },
    { id: 'exia_m', type: 'router', x: 100, y: 120, name: 'EXIA-RT-Meraki', ip: '90.154.127.203', color: '#96ceb4', interfaces: [{ name: 'FastEthernet0/0', ip: null }, { name: 'FastEthernet0/1', ip: null }, { name: 'Serial0/0/0', ip: '90.154.127.203' }, { name: 'Serial0/0/1', ip: null }, { name: 'Serial0/1/0', ip: null }, { name: 'Serial0/1/1', ip: null }, { name: 'GigabitEthernet0/2/0', ip: '2001:DB8:1000::2/64' }] },
    { id: 'exia_o', type: 'router', x: 700, y: 550, name: 'EXIA-RT-Office', ip: '192.168.1.1', color: '#96ceb4', interfaces: [{ name: 'FastEthernet0/0', ip: '192.168.1.1' }, { name: 'FastEthernet0/1', ip: null }, { name: 'GigabitEthernet0/0/0', ip: '131.50.62.245' }] },
  
    // Internet
    { id: 'internet', type: 'cloud', x: 1100, y: 320, name: 'Internet', color: '#6c5ce7', interfaces: [] }
  ]);

  const [connections, setConnections] = useState([
    // Connexions FAI
    { from: 'internet', to: 'fai1', network: '80.0.0.4/30' },
    { from: 'fai1', to: 'fai2', network: '80.0.0.8/30' },
    { from: 'fai2', to: 'fai3', network: '80.0.0.32/30' },
    { from: 'fai3', to: 'fai4', network: '80.0.0.16/30' },
    { from: 'fai4', to: 'fai5', network: '80.0.0.24/30' },

    // Connexions Core
    { from: 'fai1', to: 'dslam', network: '80.0.0.0/30' },
    { from: 'fai2', to: 'wan', network: '80.0.0.0/30' },

    // Connexions Client
    { from: 'dslam', to: 'biblio', network: '80.158.3.0/24' },
    { from: 'dslam', to: 'digi', network: '68.101.36.0/24' },
    { from: 'dslam', to: 'exia_o', network: '131.50.62.0/24' },
    { from: 'fai5', to: 'exia_m', network: '90.154.127.0/24' } 
  ]);

  const [newDevice, setNewDevice] = useState({ id: '', type: 'router', x: 100, y: 100, name: '', ip: '', color: '#96ceb4', interfaces: [] });
  const [newConnection, setNewConnection] = useState({ from: '', to: '', network: '' });

  // Fonction pour calculer les positions des étiquettes avec évitement de collision
  const calculateLabelPositions = () => {
    const labels = {};
    const usedSpaces = [];

    connections.forEach(({ from, to, network }) => {
      const fromDevice = devices.find(d => d.id === from);
      const toDevice = devices.find(d => d.id === to);
      
      // Position de base au milieu de la connexion
      const baseX = (fromDevice.x + toDevice.x) / 2;
      const baseY = (fromDevice.y + toDevice.y) / 2;
      
      // Essayer différentes positions jusqu'à trouver un espace libre
      let offset = 0;
      let found = false;
      const directions = [-1, 1];
      const step = 20;
      
      while (!found && Math.abs(offset) < 100) {
        for (const direction of directions) {
          const testY = baseY + (offset * direction);
          
          // Vérifier si cette position est libre
          const hasOverlap = usedSpaces.some(space => {
            return Math.abs(space.x - baseX) < 90 && 
                   Math.abs(space.y - testY) < 20;
          });
          
          if (!hasOverlap) {
            labels[`${from}-${to}`] = {
              x: baseX,
              y: testY
            };
            usedSpaces.push({
              x: baseX,
              y: testY,
              width: 90,
              height: 20
            });
            found = true;
            break;
          }
        }
        offset += step;
      }
      
      // Si aucune position n'est trouvée, utiliser la position de base
      if (!found) {
        labels[`${from}-${to}`] = {
          x: baseX,
          y: baseY
        };
      }
    });

    return labels;
  };

  // Recalculer les positions des étiquettes quand les devices bougent
  useEffect(() => {
    if (!draggingNode) {
      const newLabelPositions = calculateLabelPositions();
      setLabelOffsets(newLabelPositions);
    }
  }, [devices, draggingNode]);

  const getDeviceIcon = (type, color) => {
    const props = {
      size: 32,
      color: color,
      strokeWidth: 1.5
    };

    switch (type) {
      case 'router':
        return <Router {...props} />;
      case 'cloud':
        return <Globe {...props} size={48} />;
      default:
        return <Network {...props} />;
    }
  };

  const generateCurvedPath = (from, to) => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2;
    const curvature = 0.35;

    return `M ${from.x} ${from.y} 
            Q ${midX + dx * curvature} ${midY - dy * curvature}, 
            ${to.x} ${to.y}`;
  };

  const handleMouseDown = (event, device) => {
    event.preventDefault();
    setDraggingNode(device.id);
  };

  const handleMouseMove = (event) => {
    if (draggingNode) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      setDevices(devices.map(device =>
        device.id === draggingNode
          ? { ...device, x, y }
          : device
      ));
    }
  };

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  const handleDeviceClick = (device) => {
    setSelectedNode(selectedNode?.id === device.id ? null : device);
  };

  const handleClickOutside = (event) => {
    if (!event.target.closest('.device')) {
      setSelectedNode(null);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAddDevice = () => {
    setDevices([...devices, { ...newDevice, id: `device${devices.length + 1}` }]);
    setNewDevice({ id: '', type: 'router', x: 100, y: 100, name: '', ip: '', color: '#96ceb4', interfaces: [] });
  };

  const handleAddConnection = () => {
    setConnections([...connections, newConnection]);
    setNewConnection({ from: '', to: '', network: '' });
  };

  const handleDeleteDevice = (deviceId) => {
    setDevices(devices.filter(device => device.id !== deviceId));
    setConnections(connections.filter(connection => connection.from !== deviceId && connection.to !== deviceId));
  };

  const handleDeleteConnection = (connectionIndex) => {
    setConnections(connections.filter((_, index) => index !== connectionIndex));
  };

  return (
    <div
      style={{ 
        width: '100%', 
        maxWidth: '1479px',
        margin: '0 auto', 
        padding: '20px',
        fontFamily: 'system-ui',
        backgroundColor: '#1e293b',
        color: '#f8fafc',
        userSelect: 'none'
      }}
      onMouseUp={handleMouseUp}
    >
      <h2 style={{ 
        textAlign: 'center', 
        marginBottom: '20px',
        color: '#f8fafc',
        fontSize: '24px',
      }}>
        Topologie Réseau Interactive
      </h2>
      
      <div 
        style={{ 
          position: 'relative', 
          width: '100%', 
          height: '600px', 
          backgroundColor: '#334155',
          borderRadius: '12px',
          border: '1px solid #475569',
          overflow: 'hidden'
        }}
        onMouseMove={handleMouseMove}
      >
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <defs>
            <marker
              id="arrowhead"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
            <style>
              {`
                .dashed-line {
                  stroke-dasharray: 5, 5;
                  animation: dash 1s linear infinite;
                }
                @keyframes dash {
                  to {
                    stroke-dashoffset: -10;
                  }
                }
              `}
            </style>
          </defs>
          {connections.map(({ from, to, network }) => {
            const fromDevice = devices.find(d => d.id === from);
            const toDevice = devices.find(d => d.id === to);
            const isSelected = selectedNode && 
              (selectedNode.id === from || selectedNode.id === to);
            const path = generateCurvedPath(fromDevice, toDevice);
            const labelPosition = labelOffsets[`${from}-${to}`] || {
              x: (fromDevice.x + toDevice.x) / 2,
              y: (fromDevice.y + toDevice.y) / 2
            };
            
            return (
              <g key={`${from}-${to}`}>
                <path
                  d={path}
                  fill="none"
                  stroke={isSelected ? '#22c55e' : '#94a3b8'}
                  strokeWidth={isSelected ? "3" : "1.5"}
                  className={isSelected ? "dashed-line" : ""}
                  markerEnd="url(#arrowhead)"
                />
                <rect
                  x={labelPosition.x - 45}
                  y={labelPosition.y - 10}
                  width="90"
                  height="20"
                  fill="#1e293b"
                  rx="4"
                />
                <text
                  x={labelPosition.x}
                  y={labelPosition.y + 5}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#f8fafc"
                >
                  {network}
                </text>
                {draggingNode && (fromDevice.id === draggingNode || toDevice.id === draggingNode) && (
                  <line
                    x1={labelPosition.x}
                    y1={labelPosition.y}
                    x2={(fromDevice.x + toDevice.x) / 2}
                    y2={(fromDevice.y + toDevice.y) / 2}
                    stroke="#475569"
                    strokeWidth="1"
                    strokeDasharray="2,2"
                  />
                )}
              </g>
            );
          })}
        </svg>

        {devices.map((device) => (
          <div
            key={device.id}
            className="device"
            style={{
              position: 'absolute',
              left: device.x,
              top: device.y,
              transform: 'translate(-50%, -50%)',
              cursor: draggingNode === device.id ? 'grabbing' : 'grab',
              padding: '10px',
              borderRadius: '8px',
              backgroundColor: selectedNode?.id === device.id ? '#475569' : '#1e293b',
              transition: draggingNode === device.id ? 'none' : 'all 0.3s ease',
              zIndex: draggingNode === device.id ? 1000 : 10,
              pointerEvents: 'auto',
            }}
            onClick={() => handleDeviceClick(device)}
            onMouseDown={(e) => handleMouseDown(e, device)}
          >
            {getDeviceIcon(device.type, device.color)}
            <div style={{ 
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '4px',
              color: '#f8fafc',
              fontWeight: selectedNode?.id === device.id ? 'bold' : 'normal',
            }}>
              {device.name}
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                {device.ip}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '20px',
        backgroundColor: '#475569',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        userSelect: 'text'
      }}>
        {selectedNode ? (
          <div>
            <h3 style={{ margin: '0 0 10px 0', color: selectedNode.color }}>
              {selectedNode.name}
            </h3>
            <p style={{ margin: '0', color: '#f8fafc' }}>
              IP: {selectedNode.ip}
            </p>
            <p style={{ margin: '5px 0', color: '#f8fafc' }}>
              Connexions: {connections.filter(c => 
                c.from === selectedNode.id || c.to === selectedNode.id
              ).length}
            </p>
            <p style={{ margin: '5px 0', color: '#f8fafc' }}>
              Interfaces:
            </p>
            <ul style={{ margin: '0', padding: '0 0 0 20px', color: '#f8fafc' }}>
              {selectedNode.interfaces.map((iface, index) => (
                <li key={index}>{iface.name}: {iface.ip || 'No IP'}</li>
              ))}
            </ul>
            <button 
              style={{ 
                backgroundColor: '#ef4444', 
                color: '#f8fafc', 
                border: 'none', 
                padding: '10px 20px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                transition: 'background-color 0.3s ease',
                marginTop: '10px'
              }} 
              onClick={() => handleDeleteDevice(selectedNode.id)}
            >
              Supprimer Appareil
            </button>
          </div>
        ) : (
          <p style={{ margin: '0', color: '#94a3b8' }}>
            Cliquez sur un appareil pour voir ses détails
          </p>
        )}
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#475569', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', userSelect: 'text' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc' }}>Ajouter un nouvel appareil</h3>
        <input type="text" placeholder="Nom" value={newDevice.name} onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })} style={{ backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', padding: '10px', marginBottom: '10px', width: '100%' }} />
        <input type="text" placeholder="IP" value={newDevice.ip} onChange={(e) => setNewDevice({ ...newDevice, ip: e.target.value })} style={{ backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', padding: '10px', marginBottom: '10px', width: '100%' }} />
        <button style={{ backgroundColor: '#22c55e', color: '#f8fafc', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={handleAddDevice}>Ajouter Appareil</button>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#475569', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', userSelect: 'text' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc' }}>Ajouter une nouvelle connexion</h3>
        <input type="text" placeholder="De" value={newConnection.from} onChange={(e) => setNewConnection({ ...newConnection, from: e.target.value })} style={{ backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', padding: '10px', marginBottom: '10px', width: '100%' }} />
        <input type="text" placeholder="À" value={newConnection.to} onChange={(e) => setNewConnection({ ...newConnection, to: e.target.value })} style={{ backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', padding: '10px', marginBottom: '10px', width: '100%' }} />
        <input type="text" placeholder="Réseau" value={newConnection.network} onChange={(e) => setNewConnection({ ...newConnection, network: e.target.value })} style={{ backgroundColor: '#334155', color: '#f8fafc', border: '1px solid #475569', borderRadius: '8px', padding: '10px', marginBottom: '10px', width: '100%' }} />
        <button style={{ backgroundColor: '#22c55e', color: '#f8fafc', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onClick={handleAddConnection}>Ajouter Connexion</button>
      </div>

      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: '#475569', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', transition: 'all 0.3s ease', userSelect: 'text' }}>
        <h3 style={{ margin: '0 0 10px 0', color: '#f8fafc' }}>Supprimer une connexion</h3>
        {connections.map((connection, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <span style={{ color: '#f8fafc' }}>{connection.from} - {connection.to} ({connection.network})</span>
            <button 
              style={{ 
                backgroundColor: '#ef4444', 
                color: '#f8fafc', 
                border: 'none', 
                padding: '5px 10px', 
                borderRadius: '8px', 
                cursor: 'pointer', 
                marginLeft: '10px' 
              }} 
              onClick={() => handleDeleteConnection(index)}
            >
              Supprimer
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkTopology;