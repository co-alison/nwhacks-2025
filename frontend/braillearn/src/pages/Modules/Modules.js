import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Collapse,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import theme from "../../styles/theme";
import PageContainer from "../../components/PageContainer";
import StyledButton from "../../components/StyledButton";
import {
  School,
  Quiz as QuizIcon,
  MenuBook,
  CheckCircle,
  ExpandMore,
} from "@mui/icons-material";
import { sendChar } from "../../utils/serverApi";

const Modules = ({ modules }) => {
  const navigate = useNavigate();
  const [expandedModules, setExpandedModules] = useState({
    1: true,
    2: false,
    3: false,
  });

  // Clear dots when component mounts (entering modules page)
  // useEffect(() => {
  //     sendChar('.');
  // }, []);

  const toggleModule = (groupNum) => {
    setExpandedModules((prev) => ({
      ...prev,
      [groupNum]: !prev[groupNum],
    }));
  };

  const getModuleIcon = (type) => {
    switch (type) {
      case "overview":
        return <School sx={{ fontSize: "2rem" }} />;
      case "introduction":
        return <MenuBook sx={{ fontSize: "1.5rem" }} />;
      case "learn":
        return <School sx={{ fontSize: "1.5rem" }} />;
      case "practice-quiz":
        return <QuizIcon sx={{ fontSize: "1.5rem" }} />;
      case "quiz":
        return <CheckCircle sx={{ fontSize: "1.5rem" }} />;
      default:
        return <School sx={{ fontSize: "1.5rem" }} />;
    }
  };

  const getModuleColor = (type) => {
    switch (type) {
      case "overview":
        return {
          bg: "rgba(94, 103, 191, 0.1)",
          border: "#5e67bf",
          text: "#5e67bf",
        };
      case "introduction":
        return {
          bg: "rgba(16, 185, 129, 0.1)",
          border: "#10b981",
          text: "#059669",
        };
      case "learn":
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          border: "#3b82f6",
          text: "#2563eb",
        };
      case "practice-quiz":
        return {
          bg: "rgba(245, 158, 11, 0.1)",
          border: "#f59e0b",
          text: "#d97706",
        };
      case "quiz":
        return {
          bg: "rgba(139, 92, 246, 0.1)",
          border: "#8b5cf6",
          text: "#7c3aed",
        };
      default:
        return {
          bg: "rgba(107, 114, 128, 0.1)",
          border: "#6b7280",
          text: "#4b5563",
        };
    }
  };

  const groupedModules = {
    1: modules.filter((module) => module.group === 1),
    2: modules.filter((module) => module.group === 2),
    3: modules.filter((module) => module.group === 3),
  };

  const getGroupTitle = (groupNum) => {
    switch (groupNum) {
      case 1:
        return "Module 1: Letters A-J";
      case 2:
        return "Module 2: Letters K-T";
      case 3:
        return "Module 3: Letters U-Z";
      default:
        return `Module ${groupNum}`;
    }
  };

  return (
    <PageContainer title="Learning Modules">
      {/* Overview Button */}
      <Card
        component="button"
        tabIndex={0}
        sx={{
          marginBottom: "2rem",
          borderRadius: "12px",
          backgroundColor: "#ffffff",
          border: "2px solid #5e67bf",
          cursor: "pointer",
          transition: "transform 0.2s, box-shadow 0.2s",
          width: "100%",
          textAlign: "center",
          padding: 0,
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(94, 103, 191, 0.3)",
          },
          "&:focus": {
            outline: "3px solid #5e67bf",
            outlineOffset: "2px",
            transform: "translateY(-2px)",
          },
        }}
        onClick={() => navigate("/modules/overview")}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            navigate("/modules/overview");
          }
        }}
        aria-label="Modules Overview"
      >
        <CardContent sx={{ padding: "1.5rem", textAlign: "center" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
            }}
          >
            <School
              sx={{ fontSize: "2rem", color: "#5e67bf" }}
              aria-hidden="true"
            />
            <Typography
              variant="h5"
              component="h2"
              sx={{
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "#5e67bf",
              }}
            >
              Modules Overview
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Module Groups */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {[1, 2, 3].map((groupNum) => (
          <Card
            key={groupNum}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#ffffff",
              border: "2px solid #e2e8f0",
              overflow: "hidden",
            }}
          >
            {/* Module Group Header */}
            <Box
              component="button"
              tabIndex={0}
              role="button"
              aria-expanded={expandedModules[groupNum]}
              aria-controls={`module-group-${groupNum}`}
              sx={{
                padding: "1.25rem 1.5rem",
                backgroundColor: "#f8fafc",
                borderBottom: "1px solid #e2e8f0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                transition: "background-color 0.2s",
                width: "100%",
                border: "none",
                textAlign: "left",
                "&:hover": {
                  backgroundColor: "#f1f5f9",
                },
                "&:focus": {
                  outline: "3px solid #5e67bf",
                  outlineOffset: "-3px",
                  backgroundColor: "#f1f5f9",
                },
              }}
              onClick={() => toggleModule(groupNum)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleModule(groupNum);
                }
              }}
            >
              <Typography
                variant="h6"
                component="h2"
                sx={{
                  fontSize: "1.25rem",
                  fontWeight: 600,
                  color: "#1a1a1a",
                }}
              >
                {getGroupTitle(groupNum)}
              </Typography>
              <ExpandMore
                aria-hidden="true"
                sx={{
                  fontSize: "1.75rem",
                  color: "#6b7280",
                  transform: expandedModules[groupNum]
                    ? "rotate(180deg)"
                    : "rotate(0deg)",
                  transition: "transform 0.3s",
                }}
              />
            </Box>

            {/* Module Group Content */}
            <Collapse
              in={expandedModules[groupNum]}
              id={`module-group-${groupNum}`}
            >
              <CardContent sx={{ padding: "1.5rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "1rem",
                  }}
                >
                  {groupedModules[groupNum].map((module) => {
                    const colors = getModuleColor(module.type);
                    return (
                      <Card
                        key={module.id}
                        component="button"
                        tabIndex={0}
                        sx={{
                          borderRadius: "8px",
                          backgroundColor: colors.bg,
                          border: `2px solid ${colors.border}`,
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          width: "100%",
                          textAlign: "left",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: `0 4px 12px ${colors.border}40`,
                          },
                          "&:focus": {
                            outline: `3px solid ${colors.border}`,
                            outlineOffset: "2px",
                            transform: "translateY(-2px)",
                          },
                        }}
                        onClick={() => navigate(`/modules/${module.id}`)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            navigate(`/modules/${module.id}`);
                          }
                        }}
                        aria-label={`${module.title} - ${module.type}`}
                      >
                        <CardContent sx={{ padding: "1rem" }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: "0.75rem",
                            }}
                          >
                            <Box sx={{ color: colors.text }} aria-hidden="true">
                              {getModuleIcon(module.type)}
                            </Box>
                            <Typography
                              variant="h6"
                              component="h3"
                              sx={{
                                fontSize: "0.95rem",
                                fontWeight: 600,
                                color: colors.text,
                              }}
                            >
                              {module.title}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              </CardContent>
            </Collapse>
          </Card>
        ))}
      </Box>

      {/* Coming Soon Message */}
      <Typography
        variant="body1"
        sx={{
          marginTop: "2rem",
          textAlign: "center",
          color: "#6b7280",
          fontSize: "1rem",
          fontStyle: "italic",
        }}
      >
        More modules coming soon!
      </Typography>
    </PageContainer>
  );
};

export default Modules;
