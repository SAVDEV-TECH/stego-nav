// import React from 'react'
// interface SecurityModalprops {
// isOpen:boolean,
// isClose:void,
// failedAttempts:number
// }
// export default function SecurityModal() {
//   return (
//     <div>
//       {/* Security Alert Modal */}
//       {showSecurityModal && (
//         <div
//           onClick={() => setShowSecurityModal(false)}
//           className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center"
//         >
//           <motion.div
//             initial={{ scale: 0.8, opacity: 0, y: 50 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.8, opacity: 0, y: 50 }}
//             transition={{ type: "spring", damping: 20 }}
//             onClick={(e) => e.stopPropagation()}
//             className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
//           >
//             <motion.div
//               animate={{ opacity: [0.1, 0.2, 0.1] }}
//               transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
//               className="absolute inset-0 bg-red-500 pointer-events-none"
//             />
            
//             <div className="relative z-10">
//               <motion.div
//                 animate={{
//                   rotate: [0, -10, 10, -10, 10, 0],
//                   scale: [1, 1.1, 1],
//                 }}
//                 transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
//                 className="flex justify-center mb-4"
//               >
//                 <div className="bg-red-100 rounded-full p-4">
//                   <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                   </svg>
//                 </div>
//               </motion.div>

//               <h2 className="text-2xl font-bold text-center text-red-600 mb-2">
//                 🚨 SECURITY ALERT 🚨
//               </h2>

//               <div className="text-center space-y-3 mb-6">
//                 <p className="text-gray-800 font-semibold text-lg">
//                   Incorrect Password Detected!
//                 </p>
//                 <p className="text-gray-600">
//                   Access denied. The password you entered is incorrect.
//                 </p>
//                 <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-4">
//                   <p className="text-sm text-red-700">
//                     <span className="font-bold">Failed Attempts:</span> {failedAttempts}
//                   </p>
//                 </div>
//                 <p className="text-xs text-gray-500 mt-4">
//                   Unauthorized access attempts are being monitored.
//                 </p>
//               </div>

//               <button
//                 onClick={() => setShowSecurityModal(false)}
//                 className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
//               >
//                 Close
//               </button>
//             </div>
//           </motion.div>
//         </div>
//       )}
//     </div>
//   )
// }
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Define the props interface
interface SecurityModalProps {
  isOpen: boolean;
  onClose: () => void;
  attemptCount: number;
}

// Receive props in the function parameter
export default function SecurityModal({ isOpen, onClose, attemptCount }: SecurityModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-60 z-40 flex items-center justify-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 50 }}
            transition={{ type: "spring", damping: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full mx-4 relative overflow-hidden"
          >
            <motion.div
              animate={{ opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-red-500 pointer-events-none"
            />
            
            <div className="relative z-10">
              <motion.div
                animate={{
                  rotate: [0, -10, 10, -10, 10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }}
                className="flex justify-center mb-4"
              >
                <div className="bg-red-100 rounded-full p-4">
                  <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </motion.div>

              <h2 className="text-2xl font-bold text-center text-red-600 mb-2">
                🚨 SECURITY ALERT 🚨
              </h2>

              <div className="text-center space-y-3 mb-6">
                <p className="text-gray-800 font-semibold text-lg">
                  Incorrect Password Detected!
                </p>
                <p className="text-gray-600">
                  Access denied. The password you entered is incorrect.
                </p>
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-3 mt-4">
                  <p className="text-sm text-red-700">
                    <span className="font-bold">Failed Attempts:</span> {attemptCount}
                  </p>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  Unauthorized access attempts are being monitored.
                </p>
              </div>

              <button
                onClick={onClose}
                className="w-full bg-red-600 text-white font-semibold py-3 rounded-lg hover:bg-red-700 transition-colors shadow-lg"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}