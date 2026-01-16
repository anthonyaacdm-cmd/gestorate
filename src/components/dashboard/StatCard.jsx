
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const StatCard = ({ icon: Icon, label, value, color, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="flex items-center">
            <div className={`p-4 flex items-center justify-center ${color} bg-opacity-10 h-24 w-24`}>
              <Icon size={32} className={`text-${color.split('-')[1]}-600`} />
            </div>
            <div className="p-4 flex-1">
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wide">{label}</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatCard;
