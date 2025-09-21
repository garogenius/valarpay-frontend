"use client";

import { motion } from "framer-motion";
import { staggerContainer } from "../motion";
import { ComponentType } from "react";

const SectionWrapper = (Component: ComponentType, idName: string) =>
  function HOC() {
    console.log(idName);
    return (
      <motion.section
        variants={staggerContainer(0.5, 0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        animate="show"
      >
        <motion.div
          whileInView={{ opacity: [0, 1] }}
          transition={{ duration: 0.5, type: "tween" }}
        >
          <Component />
        </motion.div>
      </motion.section>
    );
  };

export default SectionWrapper;
