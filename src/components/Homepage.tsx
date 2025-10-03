import { motion } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Navigation } from "./Navigation";
import { ParticleField } from "./ParticleField";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Mail,
  Github,
  Linkedin,
  ExternalLink,
  Bot,
  Send,
} from "lucide-react";
import emailjs from "@emailjs/browser";

interface HomepageProps {
  onDarkModeToggle: (darkMode: boolean) => void;
  isDarkMode: boolean;
}

export function Homepage({
  onDarkModeToggle,
  isDarkMode,
}: HomepageProps) {
  const [activeSection, setActiveSection] = useState("about");
  const [showRobot, setShowRobot] = useState(false);
  const [robotPosition, setRobotPosition] = useState(20); // Position as percentage (20% = light mode
  const [isDragging, setIsDragging] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<null | typeof projects[0]>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const aboutRef = useRef<HTMLElement>(null);
  const projectsRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  const handleSectionClick = (section: string) => {
    setActiveSection(section);
    const refs = {
      about: aboutRef,
      projects: projectsRef,
      contact: contactRef,
    };

    refs[section as keyof typeof refs]?.current?.scrollIntoView(
      {
        behavior: "smooth",
        block: "start",
      },
    );
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement
    >,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    emailjs
      .send(
        "service_ow5yttv", // e.g., "service_xxx"
        "template_ibtjx7l", // e.g., "template_xxx"
        formData,
        "1u5khDk4wDgKsyHq2" // e.g., "user_xxx"
      )
      .then(
        (result) => {
          alert("Message sent successfully!");
          setFormData({ name: "", email: "", message: "" });
        },
        (error) => {
          alert("Failed to send message. Please try again.");
        }
      );
  };

  const updateRobotPosition = (clientX: number) => {
    if (!lineRef.current) return;

    const lineRect = lineRef.current.getBoundingClientRect();
    const relativeX = clientX - lineRect.left;
    const percentage = Math.max(
      0,
      Math.min(100, (relativeX / lineRect.width) * 100),
    );

    setRobotPosition(percentage);

    // Toggle dark mode when robot crosses 50% threshold
    const shouldBeDark = percentage > 50;
    if (shouldBeDark !== isDarkMode) {
      onDarkModeToggle(shouldBeDark);
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    updateRobotPosition(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging || e.touches.length === 0) return;
    updateRobotPosition(e.touches[0].clientX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchmove", handleTouchMove);
      document.addEventListener("touchend", handleTouchEnd);
      return () => {
        document.removeEventListener(
          "mousemove",
          handleMouseMove,
        );
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("touchmove", handleTouchMove);
        document.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [isDragging, isDarkMode]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "about", ref: aboutRef },
        { id: "projects", ref: projectsRef },
        { id: "contact", ref: contactRef },
      ];

      const scrollPosition = window.scrollY + 150;

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        const element = section.ref.current;
        if (element && element.offsetTop <= scrollPosition) {
          setActiveSection(section.id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!modalOpen) return;
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [modalOpen]);

  const projects = [
    {
      title: "Line Following Robot",
      description:
        "An autonomous robot that uses infrared sensors to follow a black line on the ground. Built with Arduino and programmed with PID control for smooth navigation.",
      technologies: [
        "Arduino",
        "C++",
        "IR Sensors",
        "PID Control",
      ],
      link: "#",
    },
    {
      title: "Noise Level Monitor and Alert System",
      description:
        "A system that monitors ambient noise levels using a microphone sensor and sends alerts when predefined thresholds are exceeded. Implemented with blynk."
,      technologies: ["ESP32", "Python", "IoT", "Mobile App"],
      link: "#",
    },
    {
      title: "Robotic Arm Controller",
      description:
        "A 6-DOF robotic arm controlled via computer vision. Uses OpenCV for object detection and inverse kinematics for precise movement.",
      technologies: [
        "Python",
        "OpenCV",
        "Servo Motors",
        "Kinematics",
      ],
      link: "#",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="min-h-screen bg-background transition-colors duration-500 relative overflow-hidden"
    >
      <ParticleField isDarkMode={isDarkMode} />
      <Navigation
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />

      {/* About Section */}
      <section
        ref={aboutRef}
        id="about"
        className="pt-20 sm:pt-24 pb-12 sm:pb-16 px-4 sm:px-6"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12 sm:mb-16 relative"
          >
            <div className="relative inline-block">
              <h2
                className="mb-6 cursor-pointer relative"
                onMouseEnter={() => setShowRobot(true)}
                onMouseLeave={() => setShowRobot(false)}
                onTouchStart={() => setShowRobot(true)}
                onTouchEnd={() => setShowRobot(false)}
              >
                Automaton
              </h2>

              {/* Hidden Robot */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{
                  opacity: showRobot ? 1 : 0,
                  scale: showRobot ? 1 : 0,
                  rotate: showRobot ? 0 : -180,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  duration: 0.4,
                }}
                className="absolute -top-20 left-1/2 transform -translate-x-1/2 pointer-events-none z-50"
              >
                <div className="bg-primary text-primary-foreground p-3 rounded-full shadow-lg">
                  <Bot className="h-8 w-8" />
                </div>
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary"></div>
              </motion.div>
            </div>

            <div className="max-w-2xl mx-auto space-y-6">
              <p className="text-muted-foreground">
                Computer Systems and Robotics Student making
                experimental projects to learn from them
              </p>
              <p className="text-muted-foreground">
                With experience in making projects using
                microcontrollers, sensors and much more hardware
                components, I have and still enjoy working on
                projects that challenge me to learn and grow as
                a student.
              </p>
            </div>
          </motion.div>

          {/* Interactive Line Following Robot */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative mb-12 sm:mb-16"
          >
            {/* Line and Robot Container */}
            <div className="relative h-32 flex items-center">
              {/* Horizontal Line */}
              <div
                ref={lineRef}
                className="relative w-full h-1 bg-gradient-to-r from-white via-gray-400 to-black rounded-full"
              >
                {/* Draggable Robot */}
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
                  style={{ left: `${robotPosition}%` }}
                  animate={{
                    scale: isDragging ? 1.1 : 1,
                    rotate: isDragging ? 5 : 0,
                    y: isDragging ? 2 : 0,
                  }}
                >
                  {/* Draggable Robot */}
                  <motion.div
                    className="relative cursor-grab active:cursor-grabbing touch-none"
                    onMouseDown={handleMouseDown}
                    onTouchStart={handleTouchStart}
                    whileHover={{ scale: 1.05 }}
                  >
                    {/* Robot Body */}
                    <div className="w-12 h-8 bg-primary rounded-lg border-2 border-primary-foreground shadow-lg flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>

                    {/* Robot Wheels */}
                    <motion.div
                      className="absolute -bottom-1 left-1 w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{
                        rotate: isDragging ? 360 : 0,
                      }}
                      transition={{
                        rotate: {
                          duration: 0.5,
                          repeat: isDragging ? Infinity : 0,
                          ease: "linear",
                        },
                      }}
                    ></motion.div>
                    <motion.div
                      className="absolute -bottom-1 right-1 w-2 h-2 bg-muted-foreground rounded-full"
                      animate={{
                        rotate: isDragging ? 360 : 0,
                      }}
                      transition={{
                        rotate: {
                          duration: 0.5,
                          repeat: isDragging ? Infinity : 0,
                          ease: "linear",
                        },
                      }}
                    ></motion.div>

                    {/* Sensor (IR) */}
                    <motion.div
                      className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-2 bg-red-500 rounded-sm"
                      animate={{
                        boxShadow: isDragging
                          ? "0 0 8px #ef4444"
                          : "0 0 0px #ef4444",
                      }}
                    ></motion.div>
                  </motion.div>
                </motion.div>

                {/* Progress indicator */}
                <div
                  className="absolute top-0 left-0 h-full bg-primary/30 rounded-full transition-all duration-300"
                  style={{ width: `${robotPosition}%` }}
                ></div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section
        ref={projectsRef}
        id="projects"
        className="py-12 sm:py-16 px-4 sm:px-6 bg-muted/30 transition-colors duration-500"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="mb-4">Projects</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Here are some of the projects I've worked on. Each
              one represents a unique challenge and learning
              opportunity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ y: 50, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1,
                }}
                viewport={{ once: true }}
              >
                <Card className="p-4 h-full flex flex-col transition-all duration-500 bg-card border-border">
                  <h3 className="mb-3">{project.title}</h3>
                  <p className="mb-4 flex-grow text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="outline"
                        className="text-xs border-primary/20"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    className="w-full group transition-all duration-300 hover:bg-primary/10 hover:border-primary"
                    onClick={() => {
                      setSelectedProject(project);
                      setModalOpen(true);
                    }}
                  >
                    View Project
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section
        ref={contactRef}
        id="contact"
        className="py-12 sm:py-16 px-4 sm:px-6 pb-20 sm:pb-24"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="mb-6">Get In Touch</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              I'm always interested in new opportunities and
              collaborations. Feel free to reach out if you'd
              like to work together!
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 mb-12 max-w-md sm:max-w-none mx-auto">
              <Button
                variant="outline"
                size="lg"
                className="group w-full sm:w-auto"
                onClick={() =>
                  window.open(
                    "mailto:harshit.poudel@example.com?subject=Portfolio Contact&body=Hi Harshit,",
                    "_blank",
                  )
                }
              >
                <Mail className="mr-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:scale-110" />
                Email Me
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group w-full sm:w-auto"
                onClick={() =>
                  window.open(
                    "https://github.com/harshitpoudel",
                    "_blank",
                  )
                }
              >
                <Github className="mr-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:scale-110" />
                GitHub
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="group w-full sm:w-auto"
                onClick={() =>
                  window.open(
                    "https://www.linkedin.com/in/harshit-poudel-466794299/",
                    "_blank",
                  )
                }
              >
                <Linkedin className="mr-2 h-4 sm:h-5 w-4 sm:w-5 transition-transform group-hover:scale-110" />
                LinkedIn
              </Button>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <Card className="p-4 sm:p-6 md:p-8">
              <h3 className="mb-4 sm:mb-6 text-center">
                Send me a message
              </h3>
              <form
                onSubmit={handleFormSubmit}
                className="space-y-6"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tell me about your project or just say hello!"
                    rows={6}
                    value={formData.message}
                    onChange={handleFormChange}
                    required
                  />
                </div>

                <Button type="submit" className="w-full group">
                  <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  Send Message
                </Button>
              </form>
            </Card>
          </motion.div>
        </div>
      </section>

      {modalOpen && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-all duration-300"
          onClick={() => setModalOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.25 }}
            className="bg-background rounded-xl shadow-2xl p-8 max-w-md w-full relative border border-primary/10"
            role="dialog"
            aria-modal="true"
            onClick={e => e.stopPropagation()} // Prevent modal click from closing
          >
            <button
              className="absolute top-3 right-3 text-2xl text-muted-foreground hover:text-primary transition-colors"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
              tabIndex={0}
            >
              ×
            </button>
            <h3 className="mb-2 text-xl font-bold text-primary">{selectedProject.title}</h3>
            <p className="mb-4 text-muted-foreground">{selectedProject.description}</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {selectedProject.technologies.map((tech) => (
                <Badge key={tech} variant="outline" className="text-xs border-primary/20">
                  {tech}
                </Badge>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full font-semibold"
              onClick={() => {
                setModalOpen(false);
                window.open(selectedProject.link, "_blank");
              }}
            >
              See on GitHub
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
