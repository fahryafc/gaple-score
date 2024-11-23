"use client";

import { useState, useEffect } from "react";
import {
  Trophy,
  Users,
  Calculator,
  CheckCircle,
  RefreshCcw,
  Play,
  History,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { useToast } from "@/components/ui/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Player {
  name: string;
  avatar: string;
  totalScore: number;
}

const presetPlayers: { name: string; avatar: string }[] = [
  { name: "", avatar: "" },
  { name: "", avatar: "" },
  { name: "", avatar: "" },
  { name: "", avatar: "" },
];

export default function GapleScore() {
  const [players, setPlayers] = useState<Player[]>(
    presetPlayers.map((p) => ({ ...p, totalScore: 0 }))
  );
  const [scores, setScores] = useState<number[]>(Array(4).fill(0));
  const [gameStarted, setGameStarted] = useState(false);
  const [showErrors, setShowErrors] = useState(false);
  const [scoreHistory, setScoreHistory] = useState<number[][]>([]);
  // const { toast } = useToast();

  useEffect(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const validateAndStartGame = () => {
    setShowErrors(true);
    if (players.some((player) => !player.name.trim())) {
      // toast({
      //   title: "Peringatan",
      //   description: "Semua nama pemain harus diisi!",
      //   variant: "destructive",
      // });
      return;
    }
    setGameStarted(true);
    setShowErrors(false);
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const submitRoundScores = () => {
    if (scores.some((score) => isNaN(score) || score < 0)) {
      // toast({
      //   title: "Error",
      //   description:
      //     "Skor tidak valid. Pastikan semua nilai adalah angka positif.",
      //   variant: "destructive",
      // });
      return;
    }

    const newPlayers = players.map((player, index) => ({
      ...player,
      totalScore: player.totalScore + scores[index],
    }));
    setPlayers(newPlayers);
    setScoreHistory([...scoreHistory, [...scores]]);

    const loser = newPlayers.find((player) => player.totalScore >= 200);
    if (loser) {
      // const winner = newPlayers.reduce((prev, current) =>
      //   prev.totalScore < current.totalScore ? prev : current
      // );
      // toast({
      //   title: "Permainan Selesai!",
      //   description: `${loser.name} kalah. ${winner.name} adalah pemenang dengan skor ${winner.totalScore}.`,
      // });
      confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
      });
      // resetGame();
    } else {
      setScores(Array(4).fill(0));
    }
  };

  const resetGame = () => {
    setPlayers(presetPlayers.map((p) => ({ ...p, totalScore: 0 })));
    setScores(Array(4).fill(0));
    setGameStarted(false);
    setShowErrors(false);
    setScoreHistory([]);
  };

  const getBadgeColor = (
    totalScore: number
  ): "default" | "secondary" | "destructive" => {
    if (totalScore >= 200) return "destructive";
    if (totalScore >= 100) return "secondary";
    return "default";
  };

  const getScoreTrend = (playerIndex: number) => {
    if (scoreHistory.length < 2) return null;
    const previousScore = scoreHistory[scoreHistory.length - 2][playerIndex];
    const currentScore = scoreHistory[scoreHistory.length - 1][playerIndex];
    if (currentScore > previousScore)
      return <TrendingUp className="text-green-500" />;
    if (currentScore < previousScore)
      return <TrendingDown className="text-red-500" />;
    return null;
  };

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gradient-to-br from-purple-100 to-pink-100 min-h-screen">
      <motion.header
        className="text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold flex items-center justify-center text-purple-800">
          <Trophy className="mr-2 text-yellow-500" />
          Gaple Score | Omah Kandang
        </h1>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center justify-center text-2xl text-purple-700">
              <Users className="mr-2" />
              Pemain Gaple
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {players.map((player, index) => (
                <motion.div
                  key={index}
                  className="flex items-center space-x-2"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <Input
                    value={player.name}
                    onChange={(e) => {
                      const newPlayers = [...players];
                      newPlayers[index].name = e.target.value;
                      setPlayers(newPlayers);
                    }}
                    placeholder={`Pemain ${index + 1}`}
                    disabled={gameStarted}
                    className={`${
                      showErrors && !player.name.trim() ? "border-red-500" : ""
                    } bg-white/50`}
                  />
                </motion.div>
              ))}
            </div>
            <Button
              className="w-full mt-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
              onClick={validateAndStartGame}
              disabled={gameStarted}
            >
              <Play className="mr-2" />
              Mulai Permainan
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {gameStarted && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-center text-2xl text-purple-700">
                <Calculator className="mr-2" />
                Masukkan Skor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {players.map((player, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center justify-between"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={player.avatar} alt={player.name} />
                        <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-semibold text-purple-800">
                          {player.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total: {player.totalScore}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Input
                        type="number"
                        value={scores[index]}
                        onChange={(e) => {
                          const newScores = [...scores];
                          newScores[index] = Number(e.target.value);
                          setScores(newScores);
                        }}
                        placeholder="Skor ronde"
                        className="w-24 bg-white/50"
                      />
                      <Badge variant={getBadgeColor(player.totalScore)}>
                        {player.totalScore}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="flex space-x-2 mt-6">
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
                  onClick={submitRoundScores}
                >
                  <CheckCircle className="mr-2" />
                  Submit Skor Ronde
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="flex-1 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-200 ease-in-out transform hover:scale-105"
                    >
                      <RefreshCcw className="mr-2" />
                      Reset Permainan
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Konfirmasi Reset</AlertDialogTitle>
                      <AlertDialogDescription>
                        Apakah Anda yakin ingin mereset permainan?
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction onClick={resetGame}>
                        Reset
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {scoreHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-purple-700 flex items-center justify-center">
                <History className="mr-2" />
                Riwayat Skor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-h-80 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Ronde</TableHead>
                      {players.map((player, index) => (
                        <TableHead key={index} className="text-center">
                          {player.name}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {scoreHistory.map((round, roundIndex) => (
                        <motion.tr
                          key={roundIndex}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell className="font-medium">
                            {roundIndex + 1}
                          </TableCell>
                          {round.map((score, playerIndex) => (
                            <TableCell
                              key={playerIndex}
                              className="text-center"
                            >
                              <div className="flex items-center justify-center space-x-2">
                                <span>{score}</span>
                                {getScoreTrend(playerIndex)}
                              </div>
                            </TableCell>
                          ))}
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
